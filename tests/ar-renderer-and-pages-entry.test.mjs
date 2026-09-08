import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("uses a transparent A-Frame renderer with valid component syntax", async () => {
  const arPage = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.match(
    arPage,
    /renderer="alpha: true; colorManagement: true; physicallyCorrectLights: true"/,
  );
});

test("preserva el encuadre de la cámara y apila el visor antes de escritorio", async () => {
  const stylesheet = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.module.css", appRoot),
    "utf8",
  );

  assert.match(
    stylesheet,
    /\.arViewport\s*\{[\s\S]*aspect-ratio:\s*16\s*\/\s*9/,
  );
  assert.match(
    stylesheet,
    /\.arViewport video,[\s\S]*object-fit:\s*contain\s*!important/,
  );
  assert.match(
    stylesheet,
    /\.experience\s*\{[\s\S]*grid-template-columns:\s*1fr/,
  );
  assert.match(
    stylesheet,
    /@media \(min-width:\s*64rem\)[\s\S]*\.experience\s*\{[\s\S]*grid-template-columns:/,
  );
});

test("mantiene el Reel vertical sin alterar el target ni el encuadre de cámara", async () => {
  const stylesheet = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.module.css", appRoot),
    "utf8",
  );
  const page = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.match(
    stylesheet,
    /\.targetCard\s*\{[\s\S]*aspect-ratio:\s*16\s*\/\s*9/,
  );
  assert.match(
    stylesheet,
    /\.videoViewport\s*\{[\s\S]*aspect-ratio:\s*9\s*\/\s*16[\s\S]*width:\s*min\(100%,\s*20rem\)/,
  );
  assert.match(
    page,
    /<a-video src="#ar-video-asset" position="0 0 0" width="0\.5625" height="1">/,
  );
});
