import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("renders a dedicated simulated AR experience at the existing route", async () => {
  const app = await readProjectFile("src/app/App.tsx");

  assert.match(app, /AugmentedRealityPage/);
});

test("keeps the AR viewer active while the complete video replaces the target", async () => {
  const page = await readProjectFile(
    "src/features/ar/AugmentedRealityPage.tsx",
  );

  assert.match(page, /className={styles\.videoViewport}/);
  assert.match(page, /Proyección activa/);
  assert.match(page, /Pausar/);
  assert.match(page, /Repetir/);
  assert.doesNotMatch(page, /className={styles\.videoPanel}/);
});

test("keeps the video content unobstructed and exposes playback actions outside the viewer", async () => {
  const styles = await readProjectFile(
    "src/features/ar/AugmentedRealityPage.module.css",
  );

  assert.match(styles, /object-fit: contain/);
  assert.doesNotMatch(styles, /\.trackingOverlay/);
});

test("simulates logo detection before presenting a local video without camera access", async () => {
  const page = await readProjectFile(
    "src/features/ar/AugmentedRealityPage.tsx",
  );
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  await access(
    new URL("src/assets/ar/expojuy-ra-demo.mp4", appRoot),
    constants.R_OK,
  );
  assert.match(page, /"idle" \| "scanning" \| "detected" \| "playing"/);
  assert.match(page, /Iniciar demostración/);
  assert.match(page, /Target detectado/);
  assert.match(page, /Demostración visual: no utiliza la cámara/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /playsInline/);
  assert.doesNotMatch(page, /<video[^>]*\bcontrols\b/);
  assert.match(page, /useState<ExperienceMode>\("muestra"\)/);
  assert.match(home, /Simulá el escaneo del isologotipo/);
  assert.doesNotMatch(home, /se definirá en un change específico/);
});
