import { useEffect, useRef } from "react";

import styles from "./TicketDialog.module.css";

interface TicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketDialog({ isOpen, onClose }: TicketDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) dialog.showModal();
    else if (dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      aria-labelledby="ticket-title"
    >
      <div className={styles.content}>
        <p className={styles.label}>Entradas</p>
        <h2 id="ticket-title">Información en preparación</h2>
        <p>
          La disponibilidad y el canal oficial de entradas se comunicarán cuando
          estén definidos.
        </p>
        <button type="button" onClick={onClose}>
          Cerrar información de entradas
        </button>
      </div>
    </dialog>
  );
}
