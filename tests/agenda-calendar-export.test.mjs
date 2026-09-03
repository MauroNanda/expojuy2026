import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
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
const notice = "Programación demostrativa. Fechas no confirmadas.";

const baseEvent = {
  date: "2026-09-18",
  description: "Actividad demostrativa.",
  durationMinutes: 90,
  location: "Predio ferial",
  time: "10:00",
  title: "Encuentro de apertura",
};

function linkFor(event) {
  return new URL(createCalendarLinkUrl(event, demoAgendaTimeZone, notice));
}

test("compone el enlace de calendario con los datos de la actividad", () => {
  const url = linkFor(baseEvent);

  assert.equal(
    url.origin + url.pathname,
    "https://calendar.google.com/calendar/render",
  );
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
  assert.equal(url.searchParams.get("text"), baseEvent.title);
  assert.equal(url.searchParams.get("location"), baseEvent.location);
  assert.ok(url.searchParams.get("details").includes(baseEvent.description));
});

test("convierte la hora local declarada al instante absoluto correspondiente", () => {
  // 10:00 en Jujuy (UTC-3) corresponde a las 13:00 UTC; 90 minutos después,
  // 14:30 UTC.
  assert.equal(
    linkFor(baseEvent).searchParams.get("dates"),
    "20260918T130000Z/20260918T143000Z",
  );
});

test("respeta la duración declarada de cada actividad", () => {
  const dates = linkFor({ ...baseEvent, durationMinutes: 60 }).searchParams.get(
    "dates",
  );

  assert.equal(dates, "20260918T130000Z/20260918T140000Z");
});

test("no desplaza el evento al cruzar la medianoche", () => {
  const dates = linkFor({
    ...baseEvent,
    durationMinutes: 120,
    time: "23:00",
  }).searchParams.get("dates");

  assert.equal(dates, "20260919T020000Z/20260919T040000Z");
});

test("incorpora la advertencia demostrativa en el evento", () => {
  assert.ok(linkFor(baseEvent).searchParams.get("details").includes(notice));
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
    () => linkFor({ ...baseEvent, date: "sin-fecha" }),
    /no define una fecha y hora válidas/,
  );
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

test("compone un enlace para cada actividad de la agenda demostrativa", () => {
  for (const item of demoAgenda) {
    const url = linkFor(item);
    assert.equal(url.searchParams.get("text"), item.title);
    assert.match(url.searchParams.get("dates"), /^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
  }
});

test("la Agenda deja de resolverse como punto de entrada pendiente", async () => {
  const app = await readFile(new URL("src/app/App.tsx", appRoot), "utf8");
  const page = await readFile(
    new URL("src/features/agenda/AgendaPage.tsx", appRoot),
    "utf8",
  );

  assert.match(app, /AgendaPage/);
  assert.doesNotMatch(app, /routePaths\.agenda\]:/);
  assert.match(page, /createCalendarLinkUrl/);
  assert.match(page, /aria-label=/);
});
