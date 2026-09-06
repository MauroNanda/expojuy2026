import {
  CalendarDays,
  ChevronDown,
  MapPinned,
  Menu,
  Newspaper,
  ScanLine,
  Store,
  Ticket,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { homeAnchors, routePaths } from "./routePaths";
import styles from "./Navigation.module.css";

const editorialNavigation = [
  { label: "ExpoJuy", anchor: homeAnchors.expo },
  { label: "Sectores", anchor: homeAnchors.sectors },
] as const;

const discoveryNavigation = [
  { label: "Expositores", icon: Store, path: routePaths.exhibitors },
  { label: "Agenda", icon: CalendarDays, path: routePaths.agenda },
  { label: "Noticias", icon: Newspaper, path: routePaths.news },
] as const;

const visitNavigation = [
  { label: "Mapa", icon: MapPinned, path: routePaths.map },
  {
    label: "Experiencia RA",
    icon: ScanLine,
    path: routePaths.realityAugmented,
  },
] as const;

interface NavigationProps {
  onOpenTickets: () => void;
}

export function Navigation({ onOpenTickets }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenTickets = () => {
    closeMenu();
    onOpenTickets();
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav aria-label="Navegación principal" className={styles.navigation}>
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isMenuOpen}
        aria-label={
          isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        }
        className={styles.menuToggle}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        ref={menuButtonRef}
        type="button"
      >
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div
        className={styles.navigationPanel}
        data-open={isMenuOpen}
        id="mobile-navigation-panel"
      >
        <ul className={styles.primaryLinks}>
          {editorialNavigation.map(({ label, anchor }) => (
            <li key={anchor}>
              <Link
                onClick={closeMenu}
                to={{ pathname: "/", hash: `#${anchor}` }}
              >
                {label}
              </Link>
            </li>
          ))}
          {discoveryNavigation.map(({ label, path }) => (
            <li key={path}>
              <Link onClick={closeMenu} to={path}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <ul aria-label="Planificar visita" className={styles.visitLinks}>
          {visitNavigation.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <Link onClick={closeMenu} to={path}>
                <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button type="button" onClick={handleOpenTickets}>
              <Ticket aria-hidden="true" size={16} strokeWidth={1.8} />
              <span>Entradas</span>
            </button>
          </li>
        </ul>
        <details className={styles.moreLinks}>
          <summary>
            Más <ChevronDown aria-hidden="true" size={15} strokeWidth={2} />
          </summary>
          <ul>
            <li>
              <Link
                onClick={closeMenu}
                to={{ pathname: "/", hash: `#${homeAnchors.sponsors}` }}
              >
                Sponsors
              </Link>
            </li>
            <li>
              <Link
                onClick={closeMenu}
                to={{ pathname: "/", hash: `#${homeAnchors.contact}` }}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </details>
      </div>
    </nav>
  );
}
