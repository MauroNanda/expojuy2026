import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolveAccessibilityPreferences } from "../src/shared/ui/accessibility.ts";

const appRoot = new URL("../", import.meta.url);

test("prioriza la preferencia guardada y usa el default como fallback", () => {
  const prefs = resolveAccessibilityPreferences(
    '{"textSize":"large","highContrast":true}',
  );
  assert.equal(prefs.textSize, "large");
  assert.equal(prefs.highContrast, true);

  const defaultPrefs = resolveAccessibilityPreferences(null);
  assert.equal(defaultPrefs.textSize, "normal");
  assert.equal(defaultPrefs.highContrast, false);
});

test("aplica un proveedor global de accesibilidad", async () => {
  const app = await readFile(new URL("src/app/App.tsx", appRoot), "utf8");
  assert.match(app, /AccessibilityProvider/);
});

test("expone un panel de accesibilidad y su botón", async () => {
  const button = await readFile(
    new URL("src/shared/ui/AccessibilityButton.tsx", appRoot),
    "utf8",
  );
  const buttonStyles = await readFile(
    new URL("src/shared/ui/AccessibilityButton.module.css", appRoot),
    "utf8",
  );
  const panel = await readFile(
    new URL("src/shared/ui/AccessibilityPanel.tsx", appRoot),
    "utf8",
  );
  const globalStyles = await readFile(
    new URL("src/styles/global.css", appRoot),
    "utf8",
  );

  assert.match(button, /aria-expanded/);
  assert.match(button, /aria-controls/);
  assert.match(button, /aria-haspopup="dialog"/);
  assert.match(button, /Accessibility/);
  assert.match(buttonStyles, /\.label/);
  assert.match(buttonStyles, /@media \(min-width: 64rem\)/);
  assert.match(panel, /id="accessibility-panel"/);
  assert.match(panel, /Escape/);
  assert.match(panel, /Tab/);
  assert.match(globalStyles, /\.a11y-text-large/);
  assert.match(globalStyles, /\.a11y-high-contrast/);

  assert.match(panel, /role="(dialog|menu)"/);
  assert.match(panel, /Activar alto contraste|Desactivar alto contraste/);
  assert.match(panel, /Lectura en voz alta/);
  assert.match(panel, /Instrucciones de audio para RA/);
  assert.match(panel, /disabled|Próximamente/); // Future features
});
