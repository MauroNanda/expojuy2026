import {
  CalendarDays,
  ChevronDown,
  MapPinned,
  Menu,
  Moon,
  Newspaper,
  ScanLine,
  Store,
  Ticket,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { homeAnchors, routePaths } from "./routePaths";
import type { Theme } from "../shared/ui/theme";
import styles from "./Navigation.module.css";
import { SectionLinks } from "./SectionLinks";

const homeSections = [
  { label: "Sectores", to: "/#sectores" },
  { label: "Protagonistas del Ecosistema", to: "/#polos-productivos" },
  { label: "Agenda", to: "/#agenda" },
  { label: "Experiencia RA", to: "/#experiencia-ra" },
  { label: "Noticias", to: "/#noticias" },
  { label: "Planificá tu visita", to: "/#planifica" },
] as const;

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
  onToggleTheme: () => void;
  theme: Theme;
}

export function Navigation({
  onOpenTickets,
  onToggleTheme,
  theme,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (navigationRef.current?.contains(event.target as Node)) return;
      navigationRef.current
        ?.querySelectorAll("details[open]")
        .forEach((details) => {
          if (!details.contains(event.target as Node))
            details.removeAttribute("open");
        });
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  const closeMenu = () => {
    navigationRef.current
      ?.querySelectorAll("details[open]")
      .forEach((details) => {
        details.removeAttribute("open");
      });
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
    <nav
      aria-label="Navegación principal"
      className={styles.navigation}
      ref={navigationRef}
      onBlur={(event) => {
        const details = (event.target as HTMLElement).closest("details[open]");
        if (details && !details.contains(event.relatedTarget as Node | null)) {
          requestAnimationFrame(() => {
            if (!details.contains(document.activeElement))
              details.removeAttribute("open");
          });
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        const details = (event.target as HTMLElement).closest("details[open]");
        if (details) {
          event.stopPropagation();
          details.removeAttribute("open");
          details.querySelector("summary")?.focus();
        }
      }}
    >
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
        <button
          aria-label={
            theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"
          }
          aria-pressed={theme === "dark"}
          className={styles.themeToggle}
          onClick={onToggleTheme}
          type="button"
        >
          {theme === "dark" ? (
            <Sun aria-hidden="true" size={18} />
          ) : (
            <Moon aria-hidden="true" size={18} />
          )}
          <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
        </button>
        <ul className={styles.primaryLinks}>
          {editorialNavigation.map(({ label, anchor }) => (
            <li key={anchor} className={styles.parentLink}>
              <Link
                onClick={closeMenu}
                to={{ pathname: "/", hash: `#${anchor}` }}
              >
                {label}
              </Link>
              {anchor === homeAnchors.expo && (
                <SectionLinks
                  label="Secciones de ExpoJuy"
                  links={homeSections}
                  onNavigate={closeMenu}
                />
              )}
            </li>
          ))}
          {discoveryNavigation.map(({ label, path }) => (
            <li key={path} className={styles.parentLink}>
              <Link onClick={closeMenu} to={path}>
                {label}
              </Link>
              {path === routePaths.news && (
                <SectionLinks
                  label="Subsecciones de Noticias"
                  links={[
                    {
                      label: "Canales oficiales",
                      to: "/noticias#canales-oficiales",
                    },
                  ]}
                  onNavigate={closeMenu}
                />
              )}
              {path === routePaths.exhibitors && (
                <SectionLinks
                  label="Subsecciones de Expositores"
                  links={[
                    {
                      label: "Ruta de conexiones",
                      to: "/expositores#ruta-de-conexiones",
                    },
                  ]}
                  onNavigate={closeMenu}
                />
              )}
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
        <details className={styles.moreLinks} name="global-navigation-sections">
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
