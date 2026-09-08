import { useEffect, useRef, type RefObject } from "react";
import { useAccessibility } from "./useAccessibility";
import styles from "./AccessibilityPanel.module.css";

type AccessibilityPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

export function AccessibilityPanel({
  isOpen,
  onClose,
  buttonRef,
}: AccessibilityPanelProps) {
  const { preferences, setTextSize, toggleHighContrast } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        buttonRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.panel}
      id="accessibility-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      ref={panelRef}
      tabIndex={-1}
    >
      <div className={styles.header}>
        <h2 id="accessibility-panel-title">Accesibilidad</h2>
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          onClick={() => {
            onClose();
            buttonRef.current?.focus();
          }}
          aria-label="Cerrar panel de accesibilidad"
          type="button"
        >
          ✕
        </button>
      </div>

      <div className={styles.section}>
        <h3>Texto y Visión</h3>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={() =>
              setTextSize(
                preferences.textSize === "normal" ? "large" : "normal",
              )
            }
            aria-pressed={preferences.textSize === "large"}
            type="button"
          >
            {preferences.textSize === "large"
              ? "Restablecer tamaño de texto"
              : "Aumentar tamaño de texto"}
          </button>

          <button
            className={styles.controlButton}
            onClick={toggleHighContrast}
            aria-pressed={preferences.highContrast}
            type="button"
          >
            {preferences.highContrast
              ? "Desactivar alto contraste"
              : "Activar alto contraste"}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Asistencia (Próximamente)</h3>
        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            disabled
            aria-disabled="true"
            type="button"
          >
            Lectura en voz alta{" "}
            <span className={styles.badge}>Próximamente</span>
          </button>

          <button
            className={styles.controlButton}
            disabled
            aria-disabled="true"
            type="button"
          >
            Instrucciones de audio para RA{" "}
            <span className={styles.badge}>Próximamente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
