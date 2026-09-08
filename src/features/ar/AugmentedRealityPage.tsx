import { Camera, Pause, Play, RotateCcw, ScanLine, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Register A-Frame and MindAR components
import "mind-ar/dist/mindar-image.prod.js";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";

import arDemoVideo from "../../assets/ar/expojuy-ra-demo.mp4";
import expojuyTarget from "../../assets/ar/expojuy26_isologotipo.jpg";
import arTarget from "../../assets/ar/targets.mind?url";
import styles from "./AugmentedRealityPage.module.css";

type ExperiencePhase = "idle" | "scanning" | "detected" | "playing";
type ExperienceMode = "muestra" | "camara";

type MindarSystem = {
  controller?: { dispose: () => void; stopProcessVideo: () => void };
  start: () => void;
  stop: () => void;
  video?: HTMLVideoElement;
};

type MindarScene = HTMLElement & {
  hasLoaded?: boolean;
  systems?: Record<string, MindarSystem>;
};

const phaseCopy: Record<ExperiencePhase, string> = {
  idle: "Listo para iniciar la demostración.",
  scanning: "Buscando isologotipo ExpoJuy…",
  detected: "Target detectado.",
  playing: "Proyección activa.",
};

function makeMindarStopSafe(system: MindarSystem) {
  const guardedSystem = system as MindarSystem & { stopIsGuarded?: boolean };

  if (guardedSystem.stopIsGuarded) {
    return;
  }

  const stop = system.stop.bind(system);
  system.stop = () => {
    const video = system.video;
    const stream = video?.srcObject;

    if (system.controller && stream instanceof MediaStream) {
      stop();
      return;
    }

    video?.pause();
    if (video && stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    video?.remove();
  };
  guardedSystem.stopIsGuarded = true;
}

export function AugmentedRealityPage() {
  const [mode, setMode] = useState<ExperienceMode>("muestra");
  const [phase, setPhase] = useState<ExperiencePhase>("idle");
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);
  const [isAudioPlaybackBlocked, setIsAudioPlaybackBlocked] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const arVideoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<MindarScene>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const cleanupCamera = useCallback(() => {
    videoRef.current?.pause();
    arVideoRef.current?.pause();

    const system = sceneRef.current?.systems?.["mindar-image-system"];
    if (!system) {
      return;
    }

    makeMindarStopSafe(system);
    system.stop();
  }, []);

  const switchToMuestra = () => {
    setMode("muestra");
    setHasCameraError(false);
    setIsAudioPlaybackBlocked(false);
    setPhase("idle");
    cleanupCamera();
  };

  const activateCamera = () => {
    clearTimers();
    setHasCameraError(false);
    setHasVideoError(false);
    setIsAudioPlaybackBlocked(false);
    setIsVideoPaused(false);
    setMode("camara");
    setPhase("scanning");
  };

  const startDemo = () => {
    clearTimers();
    setHasVideoError(false);
    setIsAudioPlaybackBlocked(false);
    setIsVideoPaused(false);
    
    if (mode === "muestra") {
      setPhase("scanning");
      timersRef.current = [
        window.setTimeout(() => {
          setPhase("detected");
          timersRef.current = [window.setTimeout(() => setPhase("playing"), 650)];
        }, 1800),
      ];
    } else {
      // For camera mode, A-Frame/MindAR handles the detection, we just reset state
      setPhase("scanning");
    }
  };

  const playWithSound = useCallback(() => {
    setIsAudioPlaybackBlocked(false);
    const video = mode === "muestra" ? videoRef.current : arVideoRef.current;
    if (!video) return;

    void video.play().catch(() => setIsAudioPlaybackBlocked(true));
  }, [mode]);

  const replayVideo = () => {
    const video = mode === "muestra" ? videoRef.current : arVideoRef.current;
    if (!video) return;

    video.currentTime = 0;
    playWithSound();
  };

  const togglePlayback = () => {
    const video = mode === "muestra" ? videoRef.current : arVideoRef.current;
    if (!video) return;

    if (video.paused) {
      playWithSound();
      return;
    }
    video.pause();
  };

  useEffect(() => {
    if (mode !== "camara") return;

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const onTargetFound = () => {
      setPhase("detected");
      timersRef.current.push(window.setTimeout(() => setPhase("playing"), 650));
    };

    const onTargetLost = () => {
      setPhase("scanning");
      setIsAudioPlaybackBlocked(false);
      if (arVideoRef.current) {
        arVideoRef.current.pause();
      }
    };

    const onArError = () => {
      setHasCameraError(true);
      cleanupCamera();
    };

    const startMindar = () => {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setHasCameraError(true);
        return;
      }

      const system = sceneEl.systems?.["mindar-image-system"];
      const targetEl = sceneEl.querySelector("#ar-target");

      if (!system || !targetEl) {
        setHasCameraError(true);
        return;
      }

      makeMindarStopSafe(system);
      targetEl.addEventListener("targetFound", onTargetFound);
      targetEl.addEventListener("targetLost", onTargetLost);
      sceneEl.addEventListener("arError", onArError);
      system.start();
      system.video?.style.setProperty("z-index", "0");
    };

    if (sceneEl.hasLoaded) {
      startMindar();
    } else {
      sceneEl.addEventListener("loaded", startMindar, { once: true });
    }

    return () => {
      clearTimers();
      const targetEl = sceneEl.querySelector("#ar-target");
      targetEl?.removeEventListener("targetFound", onTargetFound);
      targetEl?.removeEventListener("targetLost", onTargetLost);
      sceneEl.removeEventListener("arError", onArError);
      sceneEl.removeEventListener("loaded", startMindar);
      cleanupCamera();
    };
  }, [cleanupCamera, mode]);

  // Ensure camera is cleaned up on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      cleanupCamera();
    };
  }, [cleanupCamera]);

  useEffect(() => {
    if (phase !== "playing" || hasVideoError) return;

    const video = mode === "muestra" ? videoRef.current : arVideoRef.current;
    if (video) {
      void video.play().catch(() => setIsAudioPlaybackBlocked(true));
    }
  }, [hasVideoError, mode, phase]);

  return (
    <section className={styles.page} aria-labelledby="ar-title">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Experiencia RA</p>
        <h1 id="ar-title">Una capa que aparece al enfocar la Expo</h1>
        <p>
          En una experiencia real, la cámara reconocería el isologotipo. Esta
          pantalla recrea ese momento para la muestra.
        </p>
        <p className={styles.demoNotice}>
          {mode === "muestra" 
            ? "Demostración visual: no utiliza la cámara."
            : "Requiere HTTPS, cámara web, WebGL y navegador compatible."}
        </p>
      </header>

      <div className={styles.experience} data-phase={phase}>
        <div
          className={`${styles.targetStage} ${
            mode === "muestra" ? styles.targetStageMuestra : ""
          }`}
        >
          {mode === "camara" ? (
            <div className={styles.arViewport}>
              {hasCameraError ? (
                <div className={styles.videoFallback} role="alert">
                  <p>Cámara no disponible o permisos denegados.</p>
                  <button type="button" onClick={switchToMuestra}>
                    <X aria-hidden="true" size={18} /> Volver a Muestra
                  </button>
                </div>
              ) : (
                <>
                  <video 
                    ref={arVideoRef}
                    id="ar-video-asset" 
                    src={arDemoVideo}
                    loop={false}
                    crossOrigin="anonymous"
                    playsInline
                    style={{ display: "none" }}
                    onError={() => setHasVideoError(true)}
                    onPause={() => setIsVideoPaused(true)}
                    onPlay={() => setIsVideoPaused(false)}
                  ></video>
                  {/* @ts-expect-error a-scene is a custom element */}
                  <a-scene
                    ref={sceneRef}
                    embedded
                    mindar-image={`imageTargetSrc: ${arTarget}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no;`}
                    color-space="sRGB"
                    renderer="alpha: true; colorManagement: true; physicallyCorrectLights: true"
                    xr-mode-ui="enabled: false"
                    device-orientation-permission-ui="enabled: false"
                  >
                    {/* @ts-expect-error a-camera is a custom element */}
                    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
                    {/* @ts-expect-error a-entity is a custom element */}
                    <a-entity id="ar-target" mindar-image-target="targetIndex: 0">
                      {/* @ts-expect-error a-video is a custom element */}
                      <a-video src="#ar-video-asset" position="0 0 0" width="0.5625" height="1"></a-video>
                    {/* @ts-expect-error a-entity is a custom element */}
                    </a-entity>
                  {/* @ts-expect-error a-scene is a custom element */}
                  </a-scene>
                </>
              )}
            </div>
          ) : phase === "playing" ? (
            <div className={styles.videoViewport}>
              {hasVideoError ? (
                <div className={styles.videoFallback} role="alert">
                  <p>No se pudo cargar el video demostrativo.</p>
                  <button type="button" onClick={startDemo}>
                    <RotateCcw aria-hidden="true" size={18} /> Reiniciar
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  onError={() => setHasVideoError(true)}
                  onPause={() => setIsVideoPaused(true)}
                  onPlay={() => setIsVideoPaused(false)}
                >
                  <source src={arDemoVideo} type="video/mp4" />
                  Tu navegador no puede reproducir este video.
                </video>
              )}
            </div>
          ) : (
            <div className={styles.targetCard}>
              <img
                alt="Imagen target del isologotipo de ExpoJuy"
                src={expojuyTarget}
              />
            </div>
          )}
          
          <div aria-hidden="true" className={styles.frame} />
          {phase === "scanning" && (
            <div aria-hidden="true" className={styles.scanLine} />
          )}
          {phase === "detected" && (
            <div aria-hidden="true" className={styles.detectedMark}>
              <Sparkles size={28} />
            </div>
          )}
        </div>

        <div className={styles.statusPanel}>
          <ScanLine aria-hidden="true" size={26} />
          <p aria-live="polite" className={styles.status} role="status">
            {phaseCopy[phase]}
          </p>

          {phase === "idle" && mode === "muestra" && (
            <div className={styles.modeActions}>
              <button
                className={styles.primaryAction}
                type="button"
                onClick={startDemo}
              >
                <ScanLine aria-hidden="true" size={19} /> Iniciar demostración
              </button>
              <button
                className={styles.secondaryAction}
                type="button"
                onClick={activateCamera}
              >
                <Camera aria-hidden="true" size={19} /> Activar cámara real
              </button>
            </div>
          )}

          {phase === "scanning" && <p>Enfocando el target demostrativo…</p>}
          {phase === "detected" && <strong>Target detectado</strong>}
          {phase === "playing" && !hasVideoError && (
            <div className={styles.videoActions}>
              <p>
                El video representa la capa audiovisual que aparecería sobre el
                isologotipo.
              </p>
              {isAudioPlaybackBlocked && (
                <button type="button" onClick={playWithSound}>
                  <Play aria-hidden="true" size={18} /> Reproducir con sonido
                </button>
              )}
              {!isAudioPlaybackBlocked && (
                <button
                  aria-label={isVideoPaused ? "Reanudar video" : "Pausar video"}
                  type="button"
                  onClick={togglePlayback}
                >
                  {isVideoPaused ? (
                    <Play aria-hidden="true" size={18} />
                  ) : (
                    <Pause aria-hidden="true" size={18} />
                  )}
                  {isVideoPaused ? "Reanudar" : "Pausar"}
                </button>
              )}
              <button
                aria-label="Repetir demostración"
                type="button"
                onClick={() => {
                  if (mode === "camara") {
                    replayVideo();
                  } else {
                    startDemo();
                  }
                }}
              >
                <RotateCcw aria-hidden="true" size={18} /> Repetir
              </button>
            </div>
          )}
          
          {mode === "camara" && (
             <button
             className={styles.secondaryAction}
             style={{ marginTop: '1rem' }}
             type="button"
             onClick={switchToMuestra}
           >
             <X aria-hidden="true" size={19} /> Volver a modo muestra
           </button>
          )}
        </div>
      </div>
    </section>
  );
}
