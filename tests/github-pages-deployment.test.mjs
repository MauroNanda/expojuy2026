import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("configura Vite para los activos del proyecto de GitHub Pages", async () => {
  const viteConfig = await readFile(new URL("vite.config.ts", appRoot), "utf8");

  assert.match(viteConfig, /base:\s*["']\/expojuy2026\/["']/);
});

test("compila y publica dist mediante GitHub Actions", async () => {
  const workflow = await readFile(
    new URL(".github/workflows/deploy-pages.yml", appRoot),
    "utf8",
  );

  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /pnpm install --frozen-lockfile/);
  assert.match(workflow, /pnpm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
