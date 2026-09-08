import { Accessibility } from "lucide-react";
import { useRef, useState } from "react";
import { AccessibilityPanel } from "./AccessibilityPanel";
import styles from "./AccessibilityButton.module.css";

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.button}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-haspopup="dialog"
        aria-label={
          isOpen ? "Cerrar panel de accesibilidad" : "Abrir panel de accesibilidad"
        }
        type="button"
      >
        <Accessibility className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>Accesibilidad</span>
      </button>

      <AccessibilityPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttonRef={buttonRef}
      />
    </>
  );
}
