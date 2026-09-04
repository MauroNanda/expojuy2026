import { Pause, Play, RotateCcw, ScanLine, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import arDemoVideo from "../../assets/ar/expojuy-ra-demo.mp4";
import expojuyIsologotype from "../../assets/brand/expojuy26_isologotipo.png";
import styles from "./AugmentedRealityPage.module.css";

type ExperiencePhase = "idle" | "scanning" | "detected" | "playing";

const phaseCopy: Record<ExperiencePhase, string> = {
  idle: "Listo para iniciar la demostración.",
  scanning: "Buscando isologotipo ExpoJuy…",
  detected: "Target detectado.",
  playing: "Proyección activa.",
};

export function AugmentedRealityPage() {
  const [phase, setPhase] = useState<ExperiencePhase>("idle");
  const [hasVideoError, setHasVideoError] = useState(false);
  const [needsManualPlayback, setNeedsManualPlayback] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const startDemo = () => {
    clearTimers();
    setHasVideoError(false);
    setNeedsManualPlayback(false);
    setIsVideoPaused(false);
    setPhase("scanning");

    timersRef.current = [
      window.setTimeout(() => {
        setPhase("detected");
        timersRef.current = [window.setTimeout(() => setPhase("playing"), 650)];
      }, 1800),
    ];
  };

  const replayVideo = () => {
    setNeedsManualPlayback(false);
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => setNeedsManualPlayback(true));
  };

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      setNeedsManualPlayback(false);
      void video.play().catch(() => setNeedsManualPlayback(true));
      return;
    }

    video.pause();
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (phase !== "playing" || !videoRef.current || hasVideoError) {
      return;
    }

    void videoRef.current.play().catch(() => setNeedsManualPlayback(true));
  }, [hasVideoError, phase]);

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
          Demostración visual: no utiliza la cámara.
        </p>
      </header>

      <div className={styles.experience} data-phase={phase}>
        <div className={styles.targetStage}>
          {phase === "playing" ? (
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
                  muted
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
                alt="Isologotipo oficial de ExpoJuy"
                src={expojuyIsologotype}
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

          {phase === "idle" && (
            <button
              className={styles.primaryAction}
              type="button"
              onClick={startDemo}
            >
              <ScanLine aria-hidden="true" size={19} /> Iniciar demostración
            </button>
          )}

          {phase === "scanning" && <p>Enfocando el target demostrativo…</p>}
          {phase === "detected" && <strong>Target detectado</strong>}
          {phase === "playing" && !hasVideoError && (
            <div className={styles.videoActions}>
              <p>
                El video representa la capa audiovisual que aparecería sobre el
                isologotipo.
              </p>
              {needsManualPlayback && (
                <button type="button" onClick={replayVideo}>
                  <Play aria-hidden="true" size={18} /> Reproducir video
                </button>
              )}
              {!needsManualPlayback && (
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
                onClick={startDemo}
              >
                <RotateCcw aria-hidden="true" size={18} /> Repetir
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
