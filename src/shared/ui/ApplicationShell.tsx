import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import footerLogo from "../../assets/brand/expojuy26_horizontal.png";
import headerMark from "../../assets/brand/expojuy26_isologotipo.png";
import {
  formatEventPeriod,
  officialChannels,
  officialEventPeriod,
} from "../../content/demoContent";
import { Navigation } from "../../navigation/Navigation";
import { homeAnchors, routePaths } from "../../navigation/routePaths";
import styles from "./ApplicationShell.module.css";
import { BackToTop } from "./BackToTop";
import { useTheme } from "./useTheme";

interface ApplicationShellProps {
  children: ReactNode;
  onOpenTickets: () => void;
}

export function ApplicationShell({
  children,
  onOpenTickets,
}: ApplicationShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link aria-label="ExpoJuy 2026" className={styles.brand} to="/">
            <img alt="" src={headerMark} />
            <span aria-hidden="true">ExpoJuy 2026</span>
          </Link>
          <Navigation
            onOpenTickets={onOpenTickets}
            onToggleTheme={toggleTheme}
            theme={theme}
          />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <section className={styles.footerIdentity} aria-label="ExpoJuy 2026">
          <img
            alt="ExpoJuy 2026"
            className={styles.footerLogo}
            src={footerLogo}
          />
          <p>{formatEventPeriod(officialEventPeriod)}</p>
          <p>{officialEventPeriod.venue}</p>
        </section>
        <nav aria-label="Enlaces rápidos" className={styles.footerNavigation}>
          <h2>Explorá</h2>
          <ul className={styles.footerLinks}>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to={`/#${homeAnchors.sectors}`}>Sectores</Link>
            </li>
            <li>
              <Link to={routePaths.agenda}>Agenda</Link>
            </li>
            <li>
              <Link to={routePaths.news}>Noticias</Link>
            </li>
            <li>
              <Link to={routePaths.map}>Mapa</Link>
            </li>
            <li>
              <Link to={`/#${homeAnchors.contact}`}>Contacto</Link>
            </li>
          </ul>
        </nav>
        <section
          aria-labelledby="footer-channels-title"
          className={styles.footerChannels}
        >
          <h2 id="footer-channels-title">Canales oficiales</h2>
          <ul className={styles.footerLinks}>
            {officialChannels.map((channel) => (
              <li key={channel.url}>
                <a href={channel.url} rel="noreferrer" target="_blank">
                  {channel.name}
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.footerPending}>
            Teléfono y correo: información pendiente de confirmación.
          </p>
        </section>
        <p className={styles.footerCredit}>
          Información institucional: Cámara de Comercio Exterior de Jujuy.
        </p>
      </footer>
      <BackToTop />
    </div>
  );
}
