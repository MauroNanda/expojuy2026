import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  demoAgenda,
  demoExhibitors,
  demoSectors,
  venueMapZones,
} from "../src/content/demoContent.ts";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("renders a dedicated exhibitor directory at the existing route", async () => {
  const app = await readProjectFile("src/app/App.tsx");

  assert.match(app, /ExhibitorDirectoryPage/);
  assert.match(app, /routePaths\.exhibitors/);
});

test("keeps demonstrative exhibitors connected to sector, activity and venue", async () => {
  const content = await readProjectFile("src/content/demoContent.ts");

  assert.match(content, /agendaItemId: string/);
  assert.match(content, /venueZoneId: string/);
  assert.match(content, /visual\?: DemoExhibitorVisual/);

  for (const exhibitor of demoExhibitors) {
    assert.ok(
      demoSectors.some((sector) => sector.id === exhibitor.sectorId),
      `${exhibitor.name} debe referir a un sector existente`,
    );
    assert.ok(
      demoAgenda.some((activity) => activity.id === exhibitor.agendaItemId),
      `${exhibitor.name} debe referir a una actividad existente`,
    );
    assert.ok(
      venueMapZones.some((zone) => zone.id === exhibitor.venueZoneId),
      `${exhibitor.name} debe referir a una zona existente`,
    );
  }
});

test("offers two demonstrative actors per sector to make filtering meaningful", () => {
  assert.equal(demoExhibitors.length, 6);

  for (const sector of demoSectors) {
    const actorsInSector = demoExhibitors.filter(
      (exhibitor) => exhibitor.sectorId === sector.id,
    );

    assert.equal(
      actorsInSector.length,
      2,
      `${sector.name} debe ofrecer dos protagonistas demostrativos`,
    );
  }
});

test("allows filtering and selecting an exhibitor without external actions", async () => {
  const page = await readProjectFile(
    "src/features/exhibitors/ExhibitorDirectoryPage.tsx",
  );

  assert.match(page, /useSearchParams/);
  assert.match(page, /sector/);
  assert.match(page, /actor/);
  assert.match(page, /Ver actividad/);
  assert.match(page, /selectedZone\.label} en Mapa/);
  assert.match(page, /\?zone=\$\{selectedZone\.id\}/);
  assert.doesNotMatch(page, /mailto:|tel:|Formulario de contacto/);
});

test("opens the requested venue zone instead of the map default", async () => {
  const mapPage = await readProjectFile("src/features/map/VenueMapPage.tsx");

  assert.match(mapPage, /useSearchParams/);
  assert.match(mapPage, /searchParams\.get\("zone"\)/);
  assert.match(mapPage, /nextParams\.delete\("zone"\)/);
});
