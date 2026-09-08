import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("the shared footer derives confirmed event data and official channels from content", async () => {
  const shell = await readProjectFile("src/shared/ui/ApplicationShell.tsx");

  assert.match(shell, /officialEventPeriod/);
  assert.match(shell, /formatEventPeriod\(officialEventPeriod\)/);
  assert.match(shell, /officialChannels/);
  assert.match(shell, /Teléfono y correo: información pendiente de confirmación/);
});

test("the shell uses one responsive editorial gutter and footer grid", async () => {
  const styles = await readProjectFile(
    "src/shared/ui/ApplicationShell.module.css",
  );

  assert.match(styles, /--shell-gutter:\s*clamp\(/);
  assert.match(
    styles,
    /width:\s*min\(calc\(100% - \(2 \* var\(--shell-gutter\)\)\), 75rem\)/,
  );
  assert.match(styles, /\.footer\s*\{[\s\S]*grid-template-columns:/);
  assert.match(styles, /\.footer a:focus-visible/);
});

test("BackToTop keeps a non-interactive hidden state so it can animate out", async () => {
  const component = await readProjectFile("src/shared/ui/BackToTop.tsx");
  const styles = await readProjectFile("src/shared/ui/BackToTop.module.css");

  assert.doesNotMatch(component, /if \(!isVisible\)\s*\{\s*return null/);
  assert.match(component, /data-visible=\{isVisible\}/);
  assert.match(component, /disabled=\{!isVisible\}/);
  assert.match(component, /tabIndex=\{isVisible \? 0 : -1\}/);
  assert.match(styles, /\.control\[data-visible="false"\]/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("the footer uses the base surface and editorial hierarchy instead of a feature panel", async () => {
  const shell = await readProjectFile("src/shared/ui/ApplicationShell.tsx");
  const styles = await readProjectFile(
    "src/shared/ui/ApplicationShell.module.css",
  );

  assert.match(shell, /<h2>Explorá<\/h2>/);
  assert.match(styles, /\.footer\s*\{[\s\S]*background:\s*var\(--color-surface\)/);
  assert.match(styles, /\.footer\s*\{[\s\S]*border-top:\s*1px solid/);
  assert.match(styles, /@media \(min-width: 48rem\)[\s\S]*grid-template-columns:\s*minmax\(0, 1\.5fr\)/);
  assert.match(styles, /\.footerCredit\s*\{[\s\S]*font-size:\s*0\.8125rem/);
});
