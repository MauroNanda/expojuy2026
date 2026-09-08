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

test("no reutiliza la superficie como texto sobre acciones de marca", async () => {
  const stylesheets = await Promise.all(
    [
      "src/features/agenda/AgendaPage.module.css",
      "src/features/connection-route/ConnectionRouteSummary.module.css",
      "src/features/exhibitors/ExhibitorDirectoryPage.module.css",
      "src/features/home/HomePage.module.css",
      "src/features/tickets/TicketDialog.module.css",
      "src/shared/ui/BackToTop.module.css",
    ].map((path) => readFile(new URL(path, appRoot), "utf8")),
  );

  for (const stylesheet of stylesheets) {
    assert.doesNotMatch(stylesheet, /color:\s*var\(--color-surface\)/);
  }
});

test("mantiene oscuras las superficies destacadas al activar el tema oscuro", async () => {
  const [globalCss, homeCss, routeCss] = await Promise.all([
    readFile(new URL("src/styles/global.css", appRoot), "utf8"),
    readFile(new URL("src/features/home/HomePage.module.css", appRoot), "utf8"),
    readFile(
      new URL(
        "src/features/connection-route/ConnectionRouteSummary.module.css",
        appRoot,
      ),
      "utf8",
    ),
  ]);

  assert.match(globalCss, /--color-surface-inverse/);
  assert.match(globalCss, /--color-surface-feature/);
  assert.doesNotMatch(homeCss, /background:\s*var\(--color-ink\)/);
  assert.doesNotMatch(routeCss, /background:\s*var\(--color-ink\)/);
  assert.doesNotMatch(
    homeCss,
    /polePanel\[data-active="true"\][\s\S]{0,250}#ffffff/,
  );
});

test("mantiene legible el título de RA sin aclarar el visor", async () => {
  const arCss = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.module.css", appRoot),
    "utf8",
  );

  assert.match(arCss, /--ar-text:\s*var\(--color-ink\)/);
  assert.match(arCss, /\.intro h1[\s\S]{0,80}color:\s*var\(--ar-text\)/);
  assert.match(arCss, /\.experience[\s\S]{0,300}var\(--ar-surface\)/);
});
