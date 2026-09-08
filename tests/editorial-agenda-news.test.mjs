import assert from "node:assert/strict";
import test from "node:test";
import { demoAgenda, officialNews } from "../src/content/demoContent.ts";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const agendaPage = await readFile(
  resolve("src/features/agenda/AgendaPage.tsx"),
  "utf8",
);
const homePage = await readFile(
  resolve("src/features/home/HomePage.tsx"),
  "utf8",
);

test("cada actividad editorial conserva escena, horario y protagonistas relacionados", () => {
  assert.equal(new Set(demoAgenda.map((item) => item.date)).size, 4);
  assert.deepEqual(
    [...new Set(demoAgenda.map((item) => item.date))],
    ["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12"],
  );
  for (const date of ["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12"]) {
    assert.ok(demoAgenda.filter((item) => item.date === date).length >= 2);
  }
  for (const item of demoAgenda) {
    assert.ok(item.visual.src.endsWith(".webp"));
    assert.ok(item.visual.alt.length > 20);
    assert.match(item.visual.caption, /conceptual/i);
  }
});

test("las noticias editoriales tienen contexto, imagen conceptual y continuidad trazable", () => {
  const ordered = [...officialNews].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );
  assert.deepEqual(
    officialNews.map((item) => item.id),
    ordered.map((item) => item.id),
  );
  for (const item of officialNews) {
    assert.ok(item.context.length > 30);
    assert.ok(item.visual.src.endsWith(".webp"));
    assert.match(item.visual.caption, /conceptual/i);
    assert.match(item.source.url, /^https:\/\//);
  }
});

test("la interfaz conserva filtros, anclas específicas y continuidad desde Inicio", () => {
  assert.match(agendaPage, /aria-label="Seleccionar día de Agenda"/);
  assert.match(agendaPage, /navigate\(\{/);
  assert.match(agendaPage, /hash: location\.hash/);
  assert.match(agendaPage, /id=\{item\.id\}/);
  assert.match(
    homePage,
    /routePaths\.agenda\}\?day=\$\{item\.date\}#\$\{item\.id\}/,
  );
});
