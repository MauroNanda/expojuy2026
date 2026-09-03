/**
 * Composición de eventos de calendario para la Agenda del prototipo.
 *
 * Ninguna plataforma web puede escribir directamente en el calendario del
 * sistema operativo: toda incorporación se delega a una aplicación externa.
 * Este módulo compone el enlace que abre el calendario en línea con el evento
 * ya cargado y no depende de React ni del DOM, de modo que su salida pueda
 * verificarse de forma directa.
 */

export interface CalendarEvent {
  /** Fecha local de inicio en formato `AAAA-MM-DD`. */
  date: string;
  description: string;
  durationMinutes: number;
  location: string;
  /** Hora local de inicio en formato `HH:MM`. */
  time: string;
  title: string;
}

export interface CalendarTimeZone {
  name: string;
  /** Desplazamiento respecto de UTC en minutos; negativo al oeste. */
  utcOffsetMinutes: number;
}

const GOOGLE_CALENDAR_TEMPLATE = "https://calendar.google.com/calendar/render";

const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_MINUTE = 60_000;

/**
 * Convierte la hora local declarada de la actividad al instante absoluto
 * correspondiente. Sin esta conversión el evento aparecería desplazado en un
 * dispositivo configurado en otra zona horaria.
 */
function parseLocalStart(event: CalendarEvent, timeZone: CalendarTimeZone) {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.time.split(":").map(Number);

  if (
    [year, month, day, hour, minute].some(
      (part) => part === undefined || Number.isNaN(part),
    )
  ) {
    throw new Error(
      `La actividad "${event.title}" no define una fecha y hora válidas.`,
    );
  }

  // `Date.UTC` interpreta las partes como UTC; restar el desplazamiento
  // devuelve el instante que corresponde a esa hora local.
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) -
      timeZone.utcOffsetMinutes * MILLISECONDS_PER_MINUTE,
  );
}

/**
 * Expresa un instante en UTC. Toda aplicación de calendario lo interpreta sin
 * ambigüedad y sin necesidad de resolver una definición de zona horaria.
 */
function toUtcStamp(instant: Date): string {
  return `${instant.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

function addMinutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * MILLISECONDS_PER_MINUTE);
}

/**
 * Compone el enlace que abre un calendario en línea con la actividad ya
 * cargada, pendiente de confirmación. Admite un solo evento por enlace: es una
 * restricción del formato y define el alcance de la acción de agendado.
 */
export function createCalendarLinkUrl(
  event: CalendarEvent,
  timeZone: CalendarTimeZone,
  notice: string,
): string {
  const start = parseLocalStart(event, timeZone);
  const end = addMinutes(start, event.durationMinutes);

  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: `${event.description}\n\n${notice}`,
    location: event.location,
    text: event.title,
  });

  return `${GOOGLE_CALENDAR_TEMPLATE}?${parameters.toString()}`;
}

/** Representación legible de la duración, para mostrar junto a la actividad. */
export function formatDuration(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / MINUTES_PER_HOUR);
  const minutes = durationMinutes % MINUTES_PER_HOUR;

  if (hours === 0) {
    return `${minutes} min`;
  }
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
