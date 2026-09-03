import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createCalendarFile,
  createCalendarFileName,
  createCalendarLinkUrl,
  formatDuration,
} from "../src/shared/calendar/calendarEvents.ts";
import {
  demoAgenda,
  demoAgendaNotice,
  demoAgendaPeriod,
  demoAgendaTimeZone,
} from "../src/content/demoContent.ts";

const appRoot = new URL("../", import.meta.url);
const generatedAt = new Date("2026-09-03T12:00:00Z");
const notice = "Programación demostrativa. Fechas no confirmadas.";

function buildFile(events) {
  return createCalendarFile(
    { events, generatedAt, timeZone: demoAgendaTimeZone },
    notice,
  );
}

/** Revierte el plegado para inspeccionar el valor lógico de cada propiedad. */
function unfold(file) {
  return file.replace(/\r\n /g, "");
}

const baseEvent = {
  date: "2026-09-18",
  description: "Actividad demostrativa.",
  durationMinutes: 90,
  id: "encuentro-apertura",
  location: "Predio ferial",
  time: "10:00",
  title: "Encuentro de apertura",
};

test("reúne todas las actividades en un único contenedor iCalendar", () => {
  const file = buildFile(demoAgenda);

  assert.equal(file.match(/BEGIN:VCALENDAR/g).length, 1);
  assert.equal(file.match(/END:VCALENDAR/g).length, 1);
  assert.equal(file.match(/BEGIN:VEVENT/g).length, demoAgenda.length);
  assert.equal(file.match(/END:VEVENT/g).length, demoAgenda.length);
});

test("expresa los horarios en UTC a partir de la hora local del evento", () => {
  // 10:00 en Jujuy (UTC-3) corresponde a las 13:00 UTC; 90 minutos después,
  // 14:30 UTC.
  const file = buildFile([baseEvent]);

  assert.match(file, /DTSTART:20260918T130000Z/);
  assert.match(file, /DTEND:20260918T143000Z/);
});

test("asigna un identificador estable derivado de la actividad", () => {
  const first = buildFile([baseEvent]);
  const second = buildFile([baseEvent]);

  assert.match(first, /UID:encuentro-apertura@agenda\.expojuy2026\.demo/);
  assert.equal(
    first.match(/UID:.*/)[0],
    second.match(/UID:.*/)[0],
    "reimportar la misma actividad debe conservar el identificador",
  );
});

test("escapa los caracteres reservados del formato", () => {
  const file = buildFile([
    {
      ...baseEvent,
      description: "Primera línea\nSegunda línea",
      location: "Stand 3; sector A, ala norte",
      title: "Ronda: proyectos, alianzas y vínculos",
    },
  ]);

  const logical = unfold(file);

  assert.match(logical, /SUMMARY:Ronda: proyectos\\, alianzas y vínculos/);
  assert.match(logical, /LOCATION:Stand 3\\; sector A\\, ala norte/);
  assert.match(logical, /DESCRIPTION:Primera línea\\nSegunda línea/);

  const description = logical
    .split("\r\n")
    .find((line) => line.startsWith("DESCRIPTION:"));
  assert.ok(
    !description.includes("\n"),
    "un salto de línea sin escapar rompería el archivo",
  );
});

test("escapa la barra invertida sin duplicar las secuencias introducidas", () => {
  const file = buildFile([{ ...baseEvent, location: "Pasillo A\\B" }]);

  assert.match(file, /LOCATION:Pasillo A\\\\B/);
});

test("pliega las líneas largas respetando el límite de octetos", () => {
  const file = buildFile([
    {
      ...baseEvent,
      description:
        "Una descripción deliberadamente extensa con acentuación española " +
        "para comprobar que el plegado mide octetos y no caracteres, " +
        "manteniendo el archivo dentro del límite del formato.",
    },
  ]);

  const encoder = new TextEncoder();
  for (const line of file.split("\r\n")) {
    assert.ok(
      encoder.encode(line).length <= 75,
      `línea de ${encoder.encode(line).length} octetos supera el límite: ${line}`,
    );
  }
  assert.match(file, /\r\n /, "las líneas plegadas continúan con un espacio");
});

test("no parte los caracteres multibyte al plegar", () => {
  const file = buildFile([{ ...baseEvent, description: "á".repeat(120) }]);

  assert.ok(
    !file.includes("�"),
    "el plegado no debe producir caracteres inválidos",
  );
});

test("termina cada línea con el separador del formato", () => {
  const file = buildFile([baseEvent]);

  assert.ok(file.endsWith("END:VCALENDAR\r\n"));
  assert.doesNotMatch(
    file.replace(/\r\n/g, ""),
    /\n/,
    "no deben quedar saltos de línea sueltos",
  );
});

test("incorpora la advertencia demostrativa en el evento generado", () => {
  const file = buildFile([baseEvent]);

  assert.ok(unfold(file).includes(escapeForComparison(notice)));
});

test("compone el enlace de calendario con los datos de la actividad", () => {
  const url = new URL(createCalendarLinkUrl(baseEvent, demoAgendaTimeZone, notice));

  assert.equal(url.origin + url.pathname, "https://calendar.google.com/calendar/render");
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
  assert.equal(url.searchParams.get("text"), baseEvent.title);
  assert.equal(url.searchParams.get("location"), baseEvent.location);
  assert.equal(
    url.searchParams.get("dates"),
    "20260918T130000Z/20260918T143000Z",
  );
  assert.ok(url.searchParams.get("details").includes(notice));
});

test("codifica los caracteres especiales del enlace", () => {
  const raw = createCalendarLinkUrl(
    { ...baseEvent, title: "Ronda: proyectos & alianzas" },
    demoAgendaTimeZone,
    notice,
  );

  assert.ok(!raw.includes("proyectos & alianzas"));
  assert.equal(
    new URL(raw).searchParams.get("text"),
    "Ronda: proyectos & alianzas",
  );
});

test("rechaza una actividad sin fecha u hora válidas", () => {
  assert.throws(
    () => buildFile([{ ...baseEvent, date: "sin-fecha" }]),
    /no define una fecha y hora válidas/,
  );
});

test("nombra el archivo según la cantidad de actividades", () => {
  assert.equal(createCalendarFileName(1), "expojuy2026-actividad.ics");
  assert.equal(createCalendarFileName(3), "expojuy2026-agenda.ics");
});

test("presenta la duración de forma legible", () => {
  assert.equal(formatDuration(45), "45 min");
  assert.equal(formatDuration(60), "1 h");
  assert.equal(formatDuration(90), "1 h 30 min");
  assert.equal(formatDuration(120), "2 h");
});

test("define la programación demostrativa con fecha, duración y lugar", () => {
  assert.ok(demoAgenda.length > 0);
  for (const item of demoAgenda) {
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.time, /^\d{2}:\d{2}$/);
    assert.ok(item.durationMinutes > 0);
    assert.ok(item.location.length > 0);
  }
});

test("mantiene las actividades dentro del período demostrativo declarado", () => {
  for (const item of demoAgenda) {
    assert.ok(
      item.date >= demoAgendaPeriod.startDate &&
        item.date <= demoAgendaPeriod.endDate,
      `la actividad "${item.id}" queda fuera del período declarado`,
    );
  }
});

test("declara la agenda como programación no confirmada", () => {
  assert.match(demoAgendaNotice, /demostrativa/i);
  assert.match(demoAgendaNotice, /no están confirmad/i);
});

test("usa el desplazamiento horario de Jujuy sin horario de verano", () => {
  assert.equal(demoAgendaTimeZone.name, "America/Argentina/Jujuy");
  assert.equal(demoAgendaTimeZone.utcOffsetMinutes, -180);
});

test("la Agenda deja de resolverse como punto de entrada pendiente", async () => {
  const app = await readFile(new URL("src/app/App.tsx", appRoot), "utf8");
  const page = await readFile(
    new URL("src/features/agenda/AgendaPage.tsx", appRoot),
    "utf8",
  );

  assert.match(app, /AgendaPage/);
  assert.doesNotMatch(app, /routePaths\.agenda\]:/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-pressed/);
});

/** Reproduce el escapado del módulo para comparar el texto ya transformado. */
function escapeForComparison(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}
