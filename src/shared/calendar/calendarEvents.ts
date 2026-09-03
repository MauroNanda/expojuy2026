/**
 * Composición de eventos de calendario para la Agenda del prototipo.
 *
 * Ninguna plataforma web puede escribir directamente en el calendario del
 * sistema operativo: toda incorporación se delega a una aplicación externa.
 * Este módulo produce las dos formas de delegación disponibles —un archivo
 * iCalendar para varias actividades y un enlace de calendario en línea para
 * una sola— y no depende de React ni del DOM, de modo que su salida pueda
 * verificarse de forma directa.
 */

export interface CalendarEvent {
  /** Fecha local de inicio en formato `AAAA-MM-DD`. */
  date: string;
  description: string;
  durationMinutes: number;
  /** Identificador estable de la actividad de origen. */
  id: string;
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

export interface CalendarFileOptions {
  events: CalendarEvent[];
  /** Momento de generación; se expone para obtener salidas reproducibles. */
  generatedAt: Date;
  timeZone: CalendarTimeZone;
}

/**
 * Dominio del identificador de cada evento. Mantenerlo estable permite que la
 * aplicación de calendario reconozca una actividad reimportada como la misma
 * en lugar de crear un duplicado.
 */
const UID_DOMAIN = "agenda.expojuy2026.demo";

const PRODUCT_ID = "-//ExpoJuy 2026//Agenda demostrativa//ES";

/**
 * Límite de octetos por línea definido por iCalendar. Las líneas más largas se
 * pliegan; sin plegado, algunas aplicaciones rechazan el archivo sin informar
 * el motivo.
 */
const MAX_LINE_OCTETS = 75;

const GOOGLE_CALENDAR_TEMPLATE = "https://calendar.google.com/calendar/render";

const MINUTES_PER_HOUR = 60;
const MILLISECONDS_PER_MINUTE = 60_000;

const encoder = new TextEncoder();

/**
 * Escapa los caracteres reservados de un valor de texto iCalendar. El orden
 * importa: la barra invertida debe escaparse antes que el resto para no
 * duplicar las secuencias recién introducidas.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

/**
 * Pliega una línea al límite de octetos. La medida es en octetos UTF-8 y no en
 * caracteres, porque las tildes y otros signos del español ocupan más de un
 * octeto. Las líneas de continuación comienzan con un espacio que también
 * cuenta para el límite.
 */
function foldLine(line: string): string {
  const segments: string[] = [];
  let current = "";
  let currentOctets = 0;
  let limit = MAX_LINE_OCTETS;

  for (const character of line) {
    const octets = encoder.encode(character).length;
    if (currentOctets + octets > limit) {
      segments.push(current);
      current = "";
      currentOctets = 0;
      limit = MAX_LINE_OCTETS - 1;
    }
    current += character;
    currentOctets += octets;
  }
  segments.push(current);

  return segments.join("\r\n ");
}

function parseLocalStart(event: CalendarEvent, timeZone: CalendarTimeZone) {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = event.time.split(":").map(Number);

  if (
    [year, month, day, hour, minute].some(
      (part) => part === undefined || Number.isNaN(part),
    )
  ) {
    throw new Error(
      `La actividad "${event.id}" no define una fecha y hora válidas.`,
    );
  }

  // `Date.UTC` interpreta las partes como UTC; restar el desplazamiento
  // convierte la hora local del evento al instante absoluto correspondiente.
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute) -
      timeZone.utcOffsetMinutes * MILLISECONDS_PER_MINUTE,
  );
}

/**
 * Expresa un instante en UTC. Se prefiere UTC a una referencia de zona horaria
 * con nombre porque no requiere incorporar la definición de la zona al archivo
 * y ninguna aplicación de calendario necesita resolverla para mostrar el
 * horario correcto.
 */
function toUtcStamp(instant: Date): string {
  return `${instant.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

function addMinutes(instant: Date, minutes: number): Date {
  return new Date(instant.getTime() + minutes * MILLISECONDS_PER_MINUTE);
}

function buildDescription(event: CalendarEvent, notice: string): string {
  return `${event.description}\n\n${notice}`;
}

/**
 * Compone el archivo iCalendar que reúne todas las actividades recibidas. Es
 * el único mecanismo disponible para incorporar varios eventos en una sola
 * operación.
 */
export function createCalendarFile(
  { events, generatedAt, timeZone }: CalendarFileOptions,
  notice: string,
): string {
  const stamp = toUtcStamp(generatedAt);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODUCT_ID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const start = parseLocalStart(event, timeZone);
    const end = addMinutes(start, event.durationMinutes);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@${UID_DOMAIN}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toUtcStamp(start)}`,
      `DTEND:${toUtcStamp(end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(buildDescription(event, notice))}`,
      `LOCATION:${escapeText(event.location)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

/**
 * Compone el enlace que abre un calendario en línea con una actividad ya
 * cargada, pendiente de confirmación. Admite un solo evento por enlace: es una
 * restricción del formato y por eso no reemplaza al archivo iCalendar.
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
    details: buildDescription(event, notice),
    location: event.location,
    text: event.title,
  });

  return `${GOOGLE_CALENDAR_TEMPLATE}?${parameters.toString()}`;
}

/** Nombre del archivo ofrecido al incorporar una selección al calendario. */
export function createCalendarFileName(eventCount: number): string {
  return eventCount === 1
    ? "expojuy2026-actividad.ics"
    : "expojuy2026-agenda.ics";
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
