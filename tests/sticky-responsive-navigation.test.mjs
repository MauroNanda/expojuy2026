import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("keeps the global header sticky and leaves anchor destinations visible", async () => {
  const shellStyles = await readProjectFile(
    "src/shared/ui/ApplicationShell.module.css",
  );
  const homeStyles = await readProjectFile(
    "src/features/home/HomePage.module.css",
  );

  assert.match(shellStyles, /\.header\s*\{[\s\S]*position:\s*sticky/);
  assert.match(shellStyles, /\.header\s*\{[\s\S]*top:\s*0/);
  assert.match(shellStyles, /--header-offset:/);
  assert.match(homeStyles, /scroll-margin-top:\s*var\(--header-offset\)/);
});

test("declares a mobile menu closed by default with an accessible toggle", async () => {
  const navigation = await readProjectFile("src/navigation/Navigation.tsx");

  assert.match(navigation, /useState\(false\)/);
  assert.match(navigation, /Abrir menú de navegación/);
  assert.match(navigation, /aria-expanded=\{isMenuOpen\}/);
  assert.match(navigation, /aria-controls="mobile-navigation-panel"/);
});

test("closes the mobile menu with Escape, returns focus, and closes before navigation", async () => {
  const navigation = await readProjectFile("src/navigation/Navigation.tsx");

  assert.match(navigation, /event\.key === "Escape"/);
  assert.match(navigation, /menuButtonRef\.current\?\.focus\(\)/);
  assert.match(navigation, /onClick=\{closeMenu\}/);
  assert.match(navigation, /onClick=\{handleOpenTickets\}/);
});

test("preserves every existing desktop navigation destination and label", async () => {
  const navigation = await readProjectFile("src/navigation/Navigation.tsx");
  const navigationStyles = await readProjectFile(
    "src/navigation/Navigation.module.css",
  );

  for (const label of [
    "ExpoJuy",
    "Sectores",
    "Expositores",
    "Agenda",
    "Noticias",
    "Mapa",
    "Experiencia RA",
    "Entradas",
    "Sponsors",
    "Contacto",
  ]) {
    assert.match(navigation, new RegExp(label));
  }

  assert.match(navigationStyles, /@media \(min-width: 64rem\)/);
  assert.match(navigationStyles, /\.navigationPanel/);
});
