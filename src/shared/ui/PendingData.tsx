import styles from "./PendingData.module.css";

interface PendingDataProps {
  className?: string;
  /** Qué dato está pendiente, para que la marca no quede sin referente. */
  children: string;
}

/**
 * Marca la información institucional que la organización todavía no proveyó.
 * El pendiente se comunica por texto: el borde discontinuo solo lo acompaña.
 */
export function PendingData({ children, className }: PendingDataProps) {
  return (
    <p className={`${styles.pending} ${className ?? ""}`}>
      <span className={styles.label}>Dato a confirmar</span>
      <span>{children}</span>
    </p>
  );
}
