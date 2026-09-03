import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { constants } from "node:fs";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("provides both official logo variants as application assets", async () => {
  await Promise.all([
    access(
      new URL("src/assets/brand/expojuy26_horizontal.png", appRoot),
      constants.R_OK,
    ),
    access(
      new URL("src/assets/brand/expojuy26_isologotipo.png", appRoot),
      constants.R_OK,
    ),
  ]);
});

test("uses the official isologotype as the accessible link to Inicio", async () => {
  const shell = await readProjectFile("src/shared/ui/ApplicationShell.tsx");

  assert.match(shell, /expojuy26_isologotipo\.png/);
  assert.match(shell, /<img[\s\S]*alt="ExpoJuy 2026"/);
  assert.doesNotMatch(shell, /aria-label="Ir al inicio de ExpoJuy 2026"/);
});

test("uses the official horizontal logo in the footer", async () => {
  const shell = await readProjectFile("src/shared/ui/ApplicationShell.tsx");

  assert.match(shell, /expojuy26_horizontal\.png/);
  assert.match(shell, /className=\{styles\.footerLogo\}/);
});

test("declares the official isologotype as the favicon", async () => {
  const indexHtml = await readProjectFile("index.html");

  assert.match(indexHtml, /expojuy26_isologotipo\.png/);
});

test("keeps the header mark and footer logo within the available width", async () => {
  const styles = await readProjectFile(
    "src/shared/ui/ApplicationShell.module.css",
  );

  assert.match(styles, /\.brand img\s*\{[\s\S]*max-width:\s*100%/);
  assert.match(styles, /\.footerLogo\s*\{[\s\S]*max-width:\s*100%/);
});
