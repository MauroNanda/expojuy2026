import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("carga el núcleo de MindAR antes de A-Frame y arranca una escena embebida", async () => {
  const page = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );
  assert.match(page, /import "mind-ar\/dist\/mindar-image\.prod\.js";\s*import "aframe";\s*import "mind-ar\/dist\/mindar-image-aframe\.prod\.js";/);
  assert.match(page, /<a-scene[\s\S]*embedded/);
  assert.match(page, /autoStart: false/);
  assert.match(page, /system\.controller && stream instanceof MediaStream/);
  assert.match(page, /stream\.getTracks\(\)\.forEach\(\(track\) => track\.stop\(\)\)/);
  assert.match(page, /!window\.isSecureContext \|\| !navigator\.mediaDevices\?\.getUserMedia/);
  assert.match(page, /renderer="alpha: true; colorManagement: true; physicallyCorrectLights: true"/);
  assert.match(page, /makeMindarStopSafe\(system\);\s*[\s\S]*system\.start\(\)/);
});

test("mantiene visible el feed que MindAR agrega detrás de la escena", async () => {
  const stylesheet = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.module.css", appRoot),
    "utf8",
  );

  assert.match(
    stylesheet,
    /\.arViewport > video\s*\{[^}]*z-index:\s*0\s*!important/,
  );
  assert.doesNotMatch(
    stylesheet,
    /\.arViewport > video\s*\{[^}]*object-fit/,
  );
  assert.match(
    stylesheet,
    /\.arViewport > a-scene\s*\{[\s\S]*z-index:\s*1/,
  );
});

test("muestra el JPG usado para generar el target de MindAR", async () => {
  const page = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.match(
    page,
    /import expojuyTarget from "\.\.\/\.\.\/assets\/ar\/expojuy26_isologotipo\.jpg"/,
  );
  assert.match(page, /alt="Imagen target del isologotipo de ExpoJuy"/);
  assert.match(page, /src=\{expojuyTarget\}/);
});

test("intenta reproducir la proyeccion con sonido y ofrece recuperacion accesible", async () => {
  const page = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.doesNotMatch(page, /\bmuted\b/);
  assert.match(page, /isAudioPlaybackBlocked/);
  assert.match(
    page,
    /video\.play\(\)\.catch\(\(\) => setIsAudioPlaybackBlocked\(true\)\)/,
  );
  assert.match(page, /Reproducir con sonido/);
  assert.match(page, /onClick=\{playWithSound\}/);
});
