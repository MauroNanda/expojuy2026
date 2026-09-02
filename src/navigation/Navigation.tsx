import {
  CalendarDays,
  ChevronDown,
  MapPinned,
  Newspaper,
  ScanLine,
  Store,
  Ticket,
} from "lucide-react";
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
  return (
    <nav aria-label="Navegación principal" className={styles.navigation}>
      <ul className={styles.primaryLinks}>
        {editorialNavigation.map(({ label, anchor }) => (
          <li key={anchor}>
            <a href={`/#${anchor}`}>{label}</a>
          </li>
        ))}
        {discoveryNavigation.map(({ label, path }) => (
          <li key={path}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
      <ul aria-label="Planificar visita" className={styles.visitLinks}>
        {visitNavigation.map(({ label, icon: Icon, path }) => (
          <li key={path}>
            <Link to={path}>
              <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button type="button" onClick={onOpenTickets}>
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
            <a href={`/#${homeAnchors.sponsors}`}>Sponsors</a>
          </li>
          <li>
            <a href={`/#${homeAnchors.contact}`}>Contacto</a>
          </li>
        </ul>
      </details>
    </nav>
  );
}
