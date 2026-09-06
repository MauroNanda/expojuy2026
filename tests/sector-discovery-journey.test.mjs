import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  demoAgenda,
  demoExhibitors,
  demoInterests,
  demoSectors,
  venueMapZones,
} from "../src/content/demoContent.ts";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("configura desplazamiento suave accesible y encuadre hacia Sectores", async () => {
  const globalCss = await readProjectFile("src/styles/global.css");
  const homeCss = await readProjectFile(
    "src/features/home/HomePage.module.css",
  );

  assert.match(globalCss, /html\s*\{\s*scroll-behavior:\s*smooth;/);
  assert.match(
    globalCss,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?html\s*\{\s*scroll-behavior:\s*auto;/,
  );
  assert.match(
    homeCss,
    /\.home\s+section\s*\{\s*scroll-margin-top:\s*var\(--header-offset\);/,
  );
});

test("ofrece cuatro intenciones de visita demostrativas vinculadas a la propuesta de valor", () => {
  assert.equal(demoInterests.length, 4);

  for (const interest of demoInterests) {
    assert.ok(
      demoSectors.some((sector) => sector.id === interest.sectorId),
      `La intención ${interest.label} debe vincular a un sector existente`,
    );
    assert.ok(
      demoExhibitors.some((exhibitor) => exhibitor.id === interest.highlightActorId),
      `La intención ${interest.label} debe vincular a un expositor existente`,
    );
    assert.ok(
      demoAgenda.some((activity) => activity.id === interest.highlightActivityId),
      `La intención ${interest.label} debe vincular a una actividad existente`,
    );
    assert.ok(
      venueMapZones.some((zone) => zone.id === interest.venueZoneId),
      `La intención ${interest.label} debe vincular a una zona de mapa existente`,
    );
  }
});

test("elimina la duplicidad de controles de selección y el automarcado en cascada", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  // No debe existir una segunda lista de sectores compitiendo como selector
  assert.doesNotMatch(home, /O explorá directamente un sector/);
  assert.doesNotMatch(home, /className=\{styles\.sectorExplorer\}/);

  // No debe existir automarcado en cascada data-related
  assert.doesNotMatch(home, /data-related=/);
  assert.doesNotMatch(home, /relatedInterestIds/);
});

test("presenta la ficha de recorrido sugerido en 3 pasos con enlaces directos", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(home, /¿Qué venís a descubrir en ExpoJuy\?/);
  assert.match(home, /role="tablist"/);
  assert.match(home, /role="tab"/);
  assert.match(home, /role="tabpanel"/);

  // Paso 1: Quién te espera
  assert.match(home, /Paso 1/);
  assert.match(home, /Quién te espera/);
  assert.match(home, /to=\{`\$\{routePaths\.exhibitors\}\?actor=\$\{selectedExhibitor\.id\}`\}/);

  // Paso 2: A qué hora ir
  assert.match(home, /Paso 2/);
  assert.match(home, /A qué hora ir/);
  assert.match(home, /to=\{routePaths\.agenda\}/);

  // Paso 3: Dónde encontrarlo
  assert.match(home, /Paso 3/);
  assert.match(home, /Dónde encontrarlo/);
  assert.match(home, /\?zone=\$\{selectedZone\.id\}/);
});

test("permite alternar entre los referentes del sector y enlazar a todos los expositores del sector", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");
  const homeCss = await readProjectFile(
    "src/features/home/HomePage.module.css",
  );

  assert.match(home, /Referentes del sector:/);
  assert.match(home, /actorChips/);
  assert.match(home, /actorChip/);
  assert.match(home, /Ver los \{sectorExhibitors\.length\} expositores/);
  assert.match(
    home,
    /routePaths\.exhibitors\}\?sector=\$\{selectedInterest\.sectorId\}/,
  );
  assert.match(homeCss, /\.actorSwitcher/);
  assert.match(homeCss, /\.actorChip/);
});
