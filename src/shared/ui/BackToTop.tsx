import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./BackToTop.module.css";

const visibilityThreshold = 480;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > visibilityThreshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const returnToTop = () => {
    const reducesMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({ top: 0, behavior: reducesMotion ? "auto" : "smooth" });
  };

  return (
    <button
      aria-label="Volver al inicio"
      aria-hidden={!isVisible}
      className={styles.control}
      data-visible={isVisible}
      disabled={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      title="Volver al inicio"
      type="button"
      onClick={returnToTop}
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={2.25} />
    </button>
  );
}
