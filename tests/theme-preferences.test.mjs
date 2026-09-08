import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolveTheme } from "../src/shared/ui/theme.ts";

const appRoot = new URL("../", import.meta.url);

test("prioriza la preferencia guardada y usa el sistema como fallback", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("invalid", true), "dark");
});

test("aplica un proveedor global y expone un control accesible de tema", async () => {
  const [app, navigation] = await Promise.all([
    readFile(new URL("src/app/App.tsx", appRoot), "utf8"),
    readFile(new URL("src/navigation/Navigation.tsx", appRoot), "utf8"),
  ]);

  assert.match(app, /ThemeProvider/);
  assert.match(navigation, /Activar modo oscuro/);
  assert.match(navigation, /Activar modo claro/);
  assert.match(navigation, /aria-pressed/);
});

test("define roles semanticos para ambos temas y evita texto claro fijo", async () => {
  const [globalCss, arCss] = await Promise.all([
    readFile(new URL("src/styles/global.css", appRoot), "utf8"),
    readFile(
      new URL("src/features/ar/AugmentedRealityPage.module.css", appRoot),
      "utf8",
    ),
  ]);

  assert.match(globalCss, /\[data-theme="dark"\]/);
  assert.match(globalCss, /--color-surface-raised/);
  assert.match(globalCss, /--color-on-brand/);
  assert.match(globalCss, /color-scheme:\s*dark/);
  assert.doesNotMatch(arCss, /color:\s*white/);
});
