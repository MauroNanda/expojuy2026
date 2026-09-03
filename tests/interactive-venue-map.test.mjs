import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("provides the aerial venue view as an application asset", async () => {
  await access(
    new URL("src/assets/map/venue-aerial.png", appRoot),
    constants.R_OK,
  );
});

test("defines grouped demonstration zones for the venue map", async () => {
  const content = await readProjectFile("src/content/demoContent.ts");

  assert.match(content, /export const venueMapZones/);
  assert.match(content, /areas: MapArea\[\]/);
  assert.match(content, /export const venueMapReferences/);
  assert.match(content, /id: "food-trucks"/);
  assert.match(content, /label: "Food Trucks"/);
  assert.match(content, /id: "food-trucks"[\s\S]*top: 85.5[\s\S]*rotation: -3/);
  assert.doesNotMatch(content, /id: "patio-comidas"/);
  assert.match(content, /standIds/);
  assert.match(content, /exhibitors: string\[\]/);
});

test("renders the interactive venue map at the map route", async () => {
  const app = await readProjectFile("src/app/App.tsx");
  const mapPage = await readProjectFile("src/features/map/VenueMapPage.tsx");
  const mapStyles = await readProjectFile(
    "src/features/map/VenueMapPage.module.css",
  );

  assert.match(app, /VenueMapPage/);
  assert.match(mapPage, /venueAerial/);
  assert.match(mapPage, /aria-pressed/);
  assert.match(mapPage, /aria-live="polite"/);
  assert.match(mapPage, /Mapa y expositores de demostración/);
  assert.match(mapPage, /venueMapReferences/);
  assert.match(mapPage, /aria-hidden="true"/);
  assert.match(mapPage, /data-kind={zone.kind}/);
  assert.match(mapPage, /planViewport/);
  assert.match(mapStyles, /\.planViewport/);
  assert.match(mapStyles, /\.hotspot[\s\S]*border-color/);
  assert.match(mapStyles, /\.reference[\s\S]*pointer-events: none/);
  assert.match(mapStyles, /data-kind="food"/);
  assert.match(mapStyles, /prefers-reduced-motion: reduce/);
});

test("offers secure Google Maps directions from the home page", async () => {
  const homePage = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(homePage, /¿Cómo llegar\?/);
  assert.match(homePage, /www\.google\.com\/maps\/dir\/\?api=1/);
  assert.match(homePage, /target="_blank"/);
  assert.match(homePage, /rel="noreferrer noopener"/);
});
