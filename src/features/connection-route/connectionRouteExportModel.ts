import {
  demoAgenda,
  demoAgendaNotice,
  demoAgendaTimeZone,
  demoExhibitors,
  demoSectors,
  formatEventPeriod,
  officialEventPeriod,
  venueMapZones,
  type DemoAgendaItem,
  type DemoExhibitor,
  type DemoSector,
  type VenueMapZone,
} from "../../content/demoContent.ts";
import { routePaths } from "../../navigation/routePaths.ts";

export interface ExportedActor {
  id: string;
  name: string;
  category: string;
  territory?: string;
  sectorName?: string;
  zoneId?: string;
  zoneLabel?: string;
  activityId?: string;
  activityTitle?: string;
  actorUrl: string;
  zoneUrl?: string;
  activityUrl?: string;
}

export interface ExportedActivity {
  id: string;
  date: string;
  time: string;
  durationMinutes: number;
  title: string;
  location: string;
  relatedActorNames: string[];
  activityUrl: string;
}

export const officialGoogleMapsDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=-24.1822527%2C-65.330159&travelmode=driving&dir_action=navigate";

export interface ConnectionRouteSnapshot {
  title: string;
  edition: number;
  confirmedPeriod: string;
  confirmedVenue: string;
  directionsUrl: string;
  generatedAt: string;
  notice: string;
  actors: ExportedActor[];
  activities: ExportedActivity[];
  totalActors: number;
  isValid: boolean;
  emptyReason?: string;
}

export interface SnapshotOptions {
  baseUrl?: string;
  now?: Date;
  exhibitors?: DemoExhibitor[];
  agenda?: DemoAgendaItem[];
  sectors?: DemoSector[];
  zones?: VenueMapZone[];
}

/**
 * Resuelve la URL base absoluta para los enlaces del PDF.
 * En el navegador publicado en producción utiliza origin + base path.
 * En localhost o entorno de pruebas utiliza la URL oficial de publicación.
 */
export function resolveDeploymentBaseUrl(customBaseUrl?: string): string {
  if (customBaseUrl) {
    return customBaseUrl.endsWith("/") ? customBaseUrl : `${customBaseUrl}/`;
  }

  const defaultProductionBase = "https://mauronanda.github.io/expojuy2026/";

  if (typeof window !== "undefined" && window.location) {
    const { hostname, origin } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      const base = import.meta.env?.BASE_URL ?? "/expojuy2026/";
      const cleanBase = base.startsWith("/") ? base : `/${base}`;
      const full = `${origin}${cleanBase}`;
      return full.endsWith("/") ? full : `${full}/`;
    }
  }

  return defaultProductionBase;
}

/**
 * Formatea una fecha considerando la zona horaria fija de Jujuy (UTC-3).
 */
export function formatJujuyDateTime(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat("es-AR", {
      timeZone: demoAgendaTimeZone.name,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formatter.format(date)} (hora de Jujuy)`;
  } catch {
    // Fallback con el desplazamiento conocido de -180 minutos
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const jujuyTime = new Date(utcTime + demoAgendaTimeZone.utcOffsetMinutes * 60000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = pad(jujuyTime.getDate());
    const m = pad(jujuyTime.getMonth() + 1);
    const y = jujuyTime.getFullYear();
    const hr = pad(jujuyTime.getHours());
    const min = pad(jujuyTime.getMinutes());
    return `${d}/${m}/${y}, ${hr}:${min} (hora de Jujuy)`;
  }
}

/**
 * Crea una instantánea inmutable y pura a partir de los IDs seleccionados.
 * Conserva el orden de selección y deduplica actividades por fecha y hora.
 */
export function createConnectionRouteSnapshot(
  actorIds: readonly string[],
  options: SnapshotOptions = {},
): ConnectionRouteSnapshot {
  const {
    baseUrl = resolveDeploymentBaseUrl(options.baseUrl),
    now = new Date(),
    exhibitors = demoExhibitors,
    agenda = demoAgenda,
    sectors = demoSectors,
    zones = venueMapZones,
  } = options;

  const validActors: ExportedActor[] = [];
  const actorActivitiesMap = new Map<string, { activity: DemoAgendaItem; actorNames: string[] }>();

  for (const id of actorIds) {
    const exhibitor = exhibitors.find((candidate) => candidate.id === id);
    if (!exhibitor) {
      continue;
    }

    const sector = sectors.find((candidate) => candidate.id === exhibitor.sectorId);
    const zone = zones.find((candidate) => candidate.id === exhibitor.venueZoneId);
    const activity = agenda.find((candidate) => candidate.id === exhibitor.agendaItemId);

    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const actorUrl = `${cleanBase}${routePaths.exhibitors}?actor=${encodeURIComponent(exhibitor.id)}`;
    const zoneUrl = zone ? `${cleanBase}${routePaths.map}?zone=${encodeURIComponent(zone.id)}` : undefined;
    const activityUrl = activity
      ? `${cleanBase}${routePaths.agenda}?day=${encodeURIComponent(activity.date)}#${encodeURIComponent(activity.id)}`
      : undefined;

    validActors.push({
      id: exhibitor.id,
      name: exhibitor.name,
      category: exhibitor.category,
      territory: exhibitor.territory,
      sectorName: sector?.name,
      zoneId: zone?.id,
      zoneLabel: zone?.label,
      activityId: activity?.id,
      activityTitle: activity?.title,
      actorUrl,
      zoneUrl,
      activityUrl,
    });

    if (activity) {
      const existing = actorActivitiesMap.get(activity.id);
      if (existing) {
        if (!existing.actorNames.includes(exhibitor.name)) {
          existing.actorNames.push(exhibitor.name);
        }
      } else {
        actorActivitiesMap.set(activity.id, {
          activity,
          actorNames: [exhibitor.name],
        });
      }
    }
  }

  // Ordenar actividades por fecha y luego por hora
  const activities: ExportedActivity[] = Array.from(actorActivitiesMap.values())
    .map(({ activity, actorNames }) => {
      const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
      const activityUrl = `${cleanBase}${routePaths.agenda}?day=${encodeURIComponent(activity.date)}#${encodeURIComponent(activity.id)}`;
      return {
        id: activity.id,
        date: activity.date,
        time: activity.time,
        durationMinutes: activity.durationMinutes,
        title: activity.title,
        location: activity.location,
        relatedActorNames: actorNames,
        activityUrl,
      };
    })
    .sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });

  const isValid = validActors.length > 0;
  const emptyReason = isValid
    ? undefined
    : "No hay protagonistas válidos seleccionados para generar el recorrido.";

  return {
    title: "Mi recorrido por ExpoJuy 2026",
    edition: officialEventPeriod.edition,
    confirmedPeriod: formatEventPeriod(officialEventPeriod),
    confirmedVenue: officialEventPeriod.venue,
    directionsUrl: officialGoogleMapsDirectionsUrl,
    generatedAt: formatJujuyDateTime(now),
    notice: demoAgendaNotice,
    actors: validActors,
    activities,
    totalActors: validActors.length,
    isValid,
    emptyReason,
  };
}
