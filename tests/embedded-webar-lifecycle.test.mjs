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
    /\.arViewport video,[\s\S]*z-index:\s*0\s*!important/,
  );
  assert.match(
    stylesheet,
    /\.arViewport > a-scene\s*\{[\s\S]*z-index:\s*1/,
  );
});
