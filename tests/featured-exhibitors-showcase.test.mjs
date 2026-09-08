import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  demoExhibitors,
  demoPoles,
} from "../src/content/demoContent.ts";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("presenta el escaparate cinemático de polos productivos en Inicio", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(home, /Protagonistas del Ecosistema/);
  assert.match(home, /De Jujuy al Corredor Bioceánico: los polos que mueven la Expo/);
  assert.match(home, /className=\{styles\.accordionContainer\}/);
  assert.match(home, /className=\{styles\.polePanel\}/);
  assert.match(home, /className=\{styles\.poleTrigger\}/);
  assert.match(home, /aria-expanded=\{isExpanded\}/);
  assert.match(home, /className=\{styles\.standCard\}/);
});

test("declara los 5 polos estratégicos y etiquetas territoriales auténticas de Jujuy", () => {
  assert.equal(demoPoles.length, 5, "Deben existir 5 polos productivos estratégicos");

  const poleThemes = demoPoles.map((p) => p.theme);
  assert.ok(poleThemes.includes("bioceanico"), "Debe incluir el polo bioceánico");
  assert.ok(poleThemes.includes("puna"), "Debe incluir el polo puna");
  assert.ok(poleThemes.includes("quebrada"), "Debe incluir el polo quebrada");
  assert.ok(poleThemes.includes("yungas"), "Debe incluir el polo yungas");
  assert.ok(poleThemes.includes("valles"), "Debe incluir el polo valles");

  for (const pole of demoPoles) {
    assert.ok(pole.name.length > 0, "Cada polo debe declarar un nombre");
    assert.ok(pole.shortName.length > 0, "Cada polo debe tener un nombre corto para el trigger colapsado");
    assert.ok(pole.tagline.length > 0, "Cada polo debe tener un lema");
    assert.ok(pole.highlights.length >= 2, "Cada polo debe listar al menos 2 hitos estratégicos");
    assert.ok(pole.exhibitorIds.length > 0, "Cada polo debe vincular al menos un expositor");
  }

  for (const exhibitor of demoExhibitors) {
    assert.ok(
      typeof exhibitor.territory === "string" && exhibitor.territory.length > 0,
      `${exhibitor.name} debe declarar una etiqueta territorial o estratégica`,
    );
  }
});

test("garantiza accesibilidad y semántica en la interacción del acordeón de polos", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");
  const styles = await readProjectFile("src/features/home/HomePage.module.css");

  assert.match(home, /role="region"/);
  assert.match(home, /aria-label="Polos productivos de Jujuy y el Corredor Bioceánico"/);
  assert.match(home, /id=\{`pole-tab-\$\{pole\.id\}`\}/);
  assert.match(home, /aria-controls=\{`pole-content-\$\{pole\.id\}`\}/);
  assert.match(home, /aria-labelledby=\{`pole-tab-\$\{pole\.id\}`\}/);
  assert.match(styles, /\.polePanel\[data-active="true"\]/);
});

test("vincula cada referente del polo con su zona del mapa y ofrece acceso al catálogo completo", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(home, /routePaths\.map}\?zone=\$\{zone\.id\}/);
  assert.match(home, /routePaths\.exhibitors}\?actor=\$\{exhibitor\.id\}/);
  assert.match(home, /Explorar catálogo completo de expositores/);
});

