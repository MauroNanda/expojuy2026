import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../../navigation/Navigation";
import styles from "./ApplicationShell.module.css";

interface ApplicationShellProps {
  children: ReactNode;
  onOpenTickets: () => void;
}

export function ApplicationShell({
  children,
  onOpenTickets,
}: ApplicationShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            aria-label="Ir al inicio de ExpoJuy 2026"
            className={styles.brand}
            to="/"
          >
            <span>EXPOJUY</span>
            <span>2026</span>
          </Link>
          <Navigation onOpenTickets={onOpenTickets} />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>ExpoJuy 2026 · Prototipo en evolución</p>
      </footer>
    </div>
  );
}
