import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createConnectionRouteSnapshot,
  resolveDeploymentBaseUrl,
  formatJujuyDateTime,
} from "../src/features/connection-route/connectionRouteExportModel.ts";
import {
  generateRoutePdfBytes,
  sanitizePdfText,
} from "../src/features/connection-route/connectionRoutePdfService.ts";
import {
  demoAgenda,
  demoExhibitors,
  demoSectors,
  officialEventPeriod,
  venueMapZones,
} from "../src/content/demoContent.ts";

test("resuelve la URL base absoluta para los enlaces del PDF respetando la base de despliegue", () => {
  const custom = resolveDeploymentBaseUrl("https://expojuy.jujuy.gob.ar/demo");
  assert.equal(custom, "https://expojuy.jujuy.gob.ar/demo/");

  const defaultBase = resolveDeploymentBaseUrl();
  assert.ok(defaultBase.startsWith("https://"));
  assert.ok(defaultBase.endsWith("/"));
});

test("formatea la fecha y hora considerando la zona horaria fija de Jujuy", () => {
  const date = new Date("2026-10-09T15:30:00Z");
  const formatted = formatJujuyDateTime(date);
  assert.ok(formatted.includes("hora de Jujuy"));
  // A las 15:30 UTC corresponden las 12:30 en Jujuy (UTC-3)
  assert.ok(formatted.includes("12:30"));
});

test("genera una instantánea vacía e inválida cuando no hay actores seleccionados", () => {
  const snapshot = createConnectionRouteSnapshot([]);
  assert.equal(snapshot.isValid, false);
  assert.equal(snapshot.totalActors, 0);
  assert.equal(snapshot.actors.length, 0);
  assert.equal(snapshot.activities.length, 0);
  assert.ok(snapshot.emptyReason);
});

test("omite IDs desconocidos y rechaza la instantánea si no quedan actores válidos", () => {
  const snapshot = createConnectionRouteSnapshot(["actor-fantasma-1", "actor-fantasma-2"]);
  assert.equal(snapshot.isValid, false);
  assert.equal(snapshot.totalActors, 0);
  assert.equal(snapshot.actors.length, 0);
  assert.ok(snapshot.emptyReason);
});

test("genera una instantánea válida con 1 o 3 actores conservando el orden de selección", () => {
  const actorIds = [demoExhibitors[1].id, demoExhibitors[0].id];
  const snapshot = createConnectionRouteSnapshot(actorIds, {
    baseUrl: "https://mauronanda.github.io/expojuy2026/",
  });

  assert.equal(snapshot.isValid, true);
  assert.equal(snapshot.totalActors, 2);
  assert.equal(snapshot.actors[0].id, demoExhibitors[1].id);
  assert.equal(snapshot.actors[1].id, demoExhibitors[0].id);

  // Verifica datos confirmados del evento
  assert.equal(snapshot.edition, officialEventPeriod.edition);
  assert.ok(snapshot.confirmedPeriod.includes("9 al 12 de octubre de 2026"));
  assert.equal(snapshot.confirmedVenue, officialEventPeriod.venue);
  assert.ok(snapshot.notice.length > 0);

  // Verifica enlaces absolutos
  assert.ok(snapshot.actors[0].actorUrl.startsWith("https://mauronanda.github.io/expojuy2026/expositores?actor="));
  if (snapshot.actors[0].zoneUrl) {
    assert.ok(snapshot.actors[0].zoneUrl.startsWith("https://mauronanda.github.io/expojuy2026/mapa?zone="));
  }
});

test("deduplica actividades compartidas y las ordena cronológicamente por fecha y hora", () => {
  // Mock con actividades compartidas y en días distintos
  const mockSectors = [{ id: "sec-1", name: "Sector Minería", description: "Minería" }];
  const mockZones = [{ id: "zona-1", label: "Sector A", description: "A", kind: "covered", standIds: [], exhibitors: [], areas: [] }];
  const mockAgenda = [
    {
      id: "act-tarde",
      date: "2026-10-10",
      time: "16:00",
      durationMinutes: 60,
      title: "Ronda vespertina",
      location: "Auditorio",
      sectorId: "sec-1",
      visual: { alt: "", caption: "", src: "" },
      description: "",
    },
    {
      id: "act-manana",
      date: "2026-10-09",
      time: "10:00",
      durationMinutes: 90,
      title: "Apertura conjunta",
      location: "Plaza Central",
      sectorId: "sec-1",
      visual: { alt: "", caption: "", src: "" },
      description: "",
    },
  ];
  const mockExhibitors = [
    {
      id: "actor-1",
      name: "Empresa Litio A",
      category: "Minería",
      description: "",
      sectorId: "sec-1",
      venueZoneId: "zona-1",
      agendaItemId: "act-manana",
    },
    {
      id: "actor-2",
      name: "Empresa Litio B",
      category: "Minería",
      description: "",
      sectorId: "sec-1",
      venueZoneId: "zona-1",
      agendaItemId: "act-manana", // Comparte la misma actividad
    },
    {
      id: "actor-3",
      name: "Empresa C",
      category: "Energía",
      description: "",
      sectorId: "sec-1",
      venueZoneId: "zona-1",
      agendaItemId: "act-tarde", // Actividad de otro día
    },
  ];

  const snapshot = createConnectionRouteSnapshot(["actor-1", "actor-2", "actor-3"], {
    exhibitors: mockExhibitors,
    agenda: mockAgenda,
    sectors: mockSectors,
    zones: mockZones,
  });

  assert.equal(snapshot.isValid, true);
  assert.equal(snapshot.actors.length, 3);
  // Deberían haber solo 2 actividades deduplicadas
  assert.equal(snapshot.activities.length, 2);

  // La primera debe ser la de 2026-10-09 y la segunda la de 2026-10-10
  assert.equal(snapshot.activities[0].id, "act-manana");
  assert.equal(snapshot.activities[0].date, "2026-10-09");
  assert.deepEqual(snapshot.activities[0].relatedActorNames, ["Empresa Litio A", "Empresa Litio B"]);

  assert.equal(snapshot.activities[1].id, "act-tarde");
  assert.equal(snapshot.activities[1].date, "2026-10-10");
  assert.deepEqual(snapshot.activities[1].relatedActorNames, ["Empresa C"]);
});

test("la instantánea es inmutable ante cambios posteriores del array de IDs", () => {
  const actorIds = [demoExhibitors[0].id];
  const snapshot = createConnectionRouteSnapshot(actorIds);
  assert.equal(snapshot.actors.length, 1);

  // Modificar array original
  actorIds.push(demoExhibitors[1].id);
  // La instantánea debe permanecer intacta con 1 actor
  assert.equal(snapshot.actors.length, 1);
});

test("sanitiza caracteres especiales para la compatibilidad con el estándar PDF Helvetica", () => {
  const raw = '“ExpoJuy 2026” — 17.ª edición · ¡Atención! ¿Listo?';
  const clean = sanitizePdfText(raw);
  assert.ok(!clean.includes('“'));
  assert.ok(!clean.includes('”'));
  assert.ok(!clean.includes('—'));
  assert.ok(!clean.includes('·'));
  assert.ok(clean.includes('"'));
  assert.ok(clean.includes('17.ª'));
  assert.ok(clean.includes('¡Atención!'));
  assert.ok(clean.includes('¿Listo?'));
});

test("genera bytes PDF válidos y no vacíos para un recorrido con actores", async () => {
  const snapshot = createConnectionRouteSnapshot([demoExhibitors[0].id, demoExhibitors[1].id]);
  const pdfBytes = await generateRoutePdfBytes(snapshot);

  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.length > 500);

  // Los primeros 4 bytes de cualquier PDF son "%PDF"
  const header = String.fromCharCode(...pdfBytes.subarray(0, 4));
  assert.equal(header, "%PDF");
});

test("genera bytes PDF con logotipo oficial y plano del predio integrados", async () => {
  const logoBytes = await readFile(
    new URL("../src/assets/brand/expojuy26_horizontal.png", import.meta.url),
  );
  const mapBytes = await readFile(
    new URL("../src/assets/map/venue-aerial.png", import.meta.url),
  );
  const snapshot = createConnectionRouteSnapshot([demoExhibitors[0].id, demoExhibitors[1].id]);
  const pdfBytes = await generateRoutePdfBytes(snapshot, {
    logoBytes,
    mapBytes,
  });

  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.length > 50000);
  const header = String.fromCharCode(...pdfBytes.subarray(0, 4));
  assert.equal(header, "%PDF");
});

test("falla al intentar generar PDF sobre una instantánea inválida o vacía", async () => {
  const snapshot = createConnectionRouteSnapshot([]);
  await assert.rejects(
    async () => {
      await generateRoutePdfBytes(snapshot);
    },
    {
      message: /No hay protagonistas/i,
    },
  );
});

test("el mapa presenta el panel con botón de descarga accesible, estados de carga y error", async () => {
  const mapCode = await readFile(
    new URL("../src/features/map/VenueMapPage.tsx", import.meta.url),
    "utf8",
  );
  const cssCode = await readFile(
    new URL("../src/features/map/VenueMapPage.module.css", import.meta.url),
    "utf8",
  );

  // Verifica resumen y botón de descarga en el panel del mapa
  assert.match(mapCode, /Descargar recorrido \(PDF\)/);
  assert.match(mapCode, /Generando recorrido en PDF\.\.\./);
  assert.match(mapCode, /Editar Ruta de conexiones/);
  assert.match(mapCode, /Zonas de tu recorrido/);
  assert.match(mapCode, /createConnectionRouteSnapshot/);
  assert.match(mapCode, /downloadRoutePdf/);
  assert.match(mapCode, /aria-busy=\{isGeneratingPdf\}/);
  assert.match(mapCode, /disabled=\{isGeneratingPdf\}/);
  assert.match(mapCode, /Reintentar descarga/);
  assert.match(mapCode, /role="alert"/);
  assert.match(mapCode, /role="status"/);

  // Verifica guía accesible ante selección vacía
  assert.match(mapCode, /emptyRouteNotice/);
  assert.match(mapCode, /¿Querés armar tu itinerario\?/);
  assert.match(mapCode, /Expositores/);

  // Verifica estilos de accesibilidad y estados
  assert.match(cssCode, /\.downloadButton/);
  assert.match(cssCode, /\.spinner/);
  assert.match(cssCode, /\.errorBanner/);
  assert.match(cssCode, /\.emptyRouteNotice/);
  assert.match(cssCode, /prefers-reduced-motion/);

  // Sin persistencia
  assert.doesNotMatch(mapCode, /localStorage|sessionStorage/);

  // Ofrece acceso a indicaciones en Google Maps hacia Ciudad Cultural
  assert.match(mapCode, /officialGoogleMapsDirectionsUrl/);
  assert.match(mapCode, /¿Cómo llegar al predio\? \(Google Maps\)/);
  assert.match(cssCode, /\.mapsAction/);

  // Presenta sistema de insignias/pines numerados en el resumen, lista de zonas y plano
  assert.match(mapCode, /routeIndexBadge/);
  assert.match(mapCode, /zoneNumberBadge/);
  assert.match(mapCode, /pinBadge/);
  assert.match(cssCode, /\.routeIndexBadge/);
  assert.match(cssCode, /\.zoneNumberBadge/);
  assert.match(cssCode, /\.pinBadge/);
});

test("la instantánea y el servicio PDF integran la ubicación oficial en Google Maps y el marcado de zonas", async () => {
  const snapshot = createConnectionRouteSnapshot([demoExhibitors[1].id, demoExhibitors[0].id]);
  assert.ok(snapshot.directionsUrl.includes("google.com/maps"));
  assert.ok(snapshot.directionsUrl.includes("-24.1822527%2C-65.330159"));

  const logoBytes = await readFile(
    new URL("../src/assets/brand/expojuy26_horizontal.png", import.meta.url),
  );
  const mapBytes = await readFile(
    new URL("../src/assets/map/venue-aerial.png", import.meta.url),
  );

  const pdfBytes = await generateRoutePdfBytes(snapshot, {
    logoBytes,
    mapBytes,
  });

  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.length > 50000);

  const { PDFDocument, PDFName } = await import("pdf-lib");
  const loadedDoc = await PDFDocument.load(pdfBytes);
  const page = loadedDoc.getPage(0);
  const annots = page.node.Annots();
  assert.ok(annots && annots.size() > 0);

  const uris = [];
  for (let i = 0; i < annots.size(); i++) {
    const annot = annots.lookup(i);
    const action = annot.lookup(PDFName.of("A"));
    const uri = action?.lookup(PDFName.of("URI"))?.asString();
    if (uri) uris.push(uri);
  }

  const hasGoogleMaps = uris.some((u) => u.includes("google.com/maps") && u.includes("-24.1822527"));
  assert.ok(hasGoogleMaps);
});

