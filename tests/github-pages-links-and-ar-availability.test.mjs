import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

test("usa la base de Vite para resolver rutas del router", async () => {
  const main = await readFile(new URL("src/main.tsx", appRoot), "utf8");

  assert.match(main, /<BrowserRouter basename=\{import\.meta\.env\.BASE_URL\}>/);
});

test("recupera rutas internas abiertas directamente en GitHub Pages", async () => {
  const fallback = await readFile(new URL("public/404.html", appRoot), "utf8");
  const arRedirect = await readFile(
    new URL("public/experiencia-ra/index.html", appRoot),
    "utf8",
  );
  const main = await readFile(new URL("src/main.tsx", appRoot), "utf8");

  assert.match(fallback, /location\.pathname \+ location\.search \+ location\.hash/);
  assert.match(fallback, /location\.replace/);
  assert.match(arRedirect, /location\.replace/);
  assert.match(main, /new URLSearchParams\(window\.location\.search\)\.get\("redirect"\)/);
  assert.match(main, /window\.history\.replaceState/);
});

test("conserva las anclas dentro de la base pública del proyecto", async () => {
  const navigation = await readFile(
    new URL("src/navigation/Navigation.tsx", appRoot),
    "utf8",
  );

  assert.doesNotMatch(navigation, /href=\{`\/#\$\{/);
  assert.match(navigation, /to=\{\{ pathname: "\/", hash: `#\$\{anchor\}` \}\}/);
  assert.match(
    navigation,
    /to=\{\{ pathname: "\/", hash: `#\$\{homeAnchors\.sponsors\}` \}\}/,
  );
});

test("mantiene los accesos a RA y permite activar la cámara real", async () => {
  const navigation = await readFile(
    new URL("src/navigation/Navigation.tsx", appRoot),
    "utf8",
  );
  const home = await readFile(
    new URL("src/features/home/HomePage.tsx", appRoot),
    "utf8",
  );
  const arPage = await readFile(
    new URL("src/features/ar/AugmentedRealityPage.tsx", appRoot),
    "utf8",
  );

  assert.match(navigation, /<Link onClick=\{closeMenu\} to=\{path\}>/);
  assert.match(home, /to=\{routePaths\.realityAugmented\}/);
  assert.match(arPage, /onClick=\{activateCamera\}/);
  assert.match(arPage, /Activar cámara real/);
  assert.doesNotMatch(arPage, /Cámara real temporalmente no disponible/);
});
