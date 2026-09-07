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
