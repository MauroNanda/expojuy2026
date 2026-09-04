import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  addActorToRoute,
  clearConnectionRoute,
  connectionRouteLimit,
  removeActorFromRoute,
} from "../src/features/connection-route/connectionRouteState.ts";

const appRoot = new URL("../", import.meta.url);
const availableActorIds = ["actor-a", "actor-b", "actor-c", "actor-d"];

test("keeps an ordered route of at most three known actors", () => {
  let route = [];

  for (const actorId of availableActorIds.slice(0, 3)) {
    const result = addActorToRoute(route, actorId, availableActorIds);
    assert.equal(result.kind, "added");
    route = result.actorIds;
  }

  assert.equal(connectionRouteLimit, 3);
  assert.deepEqual(route, ["actor-a", "actor-b", "actor-c"]);
  assert.equal(
    addActorToRoute(route, "actor-d", availableActorIds).kind,
    "limit-reached",
  );
  assert.equal(
    addActorToRoute(route, "actor-a", availableActorIds).kind,
    "already-selected",
  );
  assert.equal(
    addActorToRoute(route, "actor-inexistente", availableActorIds).kind,
    "unknown-actor",
  );
});

test("removes individual actors and clears the temporary route", () => {
  assert.deepEqual(
    removeActorFromRoute(["actor-a", "actor-b", "actor-c"], "actor-b"),
    ["actor-a", "actor-c"],
  );
  assert.deepEqual(clearConnectionRoute(), []);
});

test("integrates a temporary accessible connection route without persistence", async () => {
  const app = await readFile(new URL("src/app/App.tsx", appRoot), "utf8");
  const directory = await readFile(
    new URL("src/features/exhibitors/ExhibitorDirectoryPage.tsx", appRoot),
    "utf8",
  );
  const summary = await readFile(
    new URL(
      "src/features/connection-route/ConnectionRouteSummary.tsx",
      appRoot,
    ),
    "utf8",
  );
  const map = await readFile(
    new URL("src/features/map/VenueMapPage.tsx", appRoot),
    "utf8",
  );

  assert.match(app, /ConnectionRouteProvider/);
  assert.match(directory, /Sumar al recorrido/);
  assert.match(directory, /Quitar del recorrido/);
  assert.match(summary, /Ruta de conexiones/);
  assert.match(summary, /Vaciar ruta/);
  assert.match(summary, /Ver mi recorrido en el\s+mapa/);
  assert.match(summary, /role="status"/);
  assert.match(summary, /Ver\s+actividad/);
  assert.match(summary, /en Mapa/);
  assert.match(map, /useConnectionRoute/);
  assert.match(map, /data-in-route/);
  assert.match(map, /Zonas de tu recorrido/);
  assert.doesNotMatch(
    app + directory + summary + map,
    /localStorage|sessionStorage/,
  );
  assert.doesNotMatch(
    app + directory + summary + map,
    /reservar|inscrib|contactar|disponibilidad/i,
  );
});
