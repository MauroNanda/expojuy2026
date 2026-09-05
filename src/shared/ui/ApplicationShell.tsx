import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import footerLogo from "../../assets/brand/expojuy26_horizontal.png";
import headerMark from "../../assets/brand/expojuy26_isologotipo.png";
import { Navigation } from "../../navigation/Navigation";
import styles from "./ApplicationShell.module.css";
import { BackToTop } from "./BackToTop";

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
          <Link aria-label="ExpoJuy 2026" className={styles.brand} to="/">
            <img alt="" src={headerMark} />
            <span aria-hidden="true">ExpoJuy 2026</span>
          </Link>
          <Navigation onOpenTickets={onOpenTickets} />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <img
          alt="ExpoJuy 2026"
          className={styles.footerLogo}
          src={footerLogo}
        />
        <p>Prototipo en evolución</p>
      </footer>
      <BackToTop />
    </div>
  );
}
