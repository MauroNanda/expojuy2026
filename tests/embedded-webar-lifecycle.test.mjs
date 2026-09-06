import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("starts MindAR after installing a safe stop guard", async () => {
  const page = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.match(page, /autoStart: false/);
  assert.doesNotMatch(page, /navigator\.mediaDevices\.getUserMedia/);
  assert.match(page, /system\.controller && stream instanceof MediaStream/);
  assert.match(page, /stream\.getTracks\(\)\.forEach\(\(track\) => track\.stop\(\)\)/);
  assert.match(page, /!window\.isSecureContext \|\| !navigator\.mediaDevices\?\.getUserMedia/);
  assert.match(page, /renderer="alpha: true, colorManagement: true, physicallyCorrectLights"/);
  assert.match(page, /makeMindarStopSafe\(system\);\s*[\s\S]*system\.start\(\)/);
});
