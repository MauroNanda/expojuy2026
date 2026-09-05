import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("comunica marca, fecha confirmada y recorrido desde el hero", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");
  const shell = await readProjectFile("src/shared/ui/ApplicationShell.tsx");

  assert.match(home, /Fecha confirmada/);
  assert.match(home, /officialEventPeriod/);
  assert.match(home, /Explorar sectores/);
  assert.match(home, /protagonistas y actividades\s+relacionadas/);
  assert.match(shell, /aria-label="ExpoJuy 2026"/);
  assert.match(shell, /aria-hidden="true">ExpoJuy 2026/);
});

test("expresa la trama como identidad y mantiene los sectores como etiquetas", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");
  const styles = await readProjectFile("src/features/home/HomePage.module.css");
  const direction = await readProjectFile("docs/direccion-visual-inicial.md");

  for (const word of ["Producción", "Ideas", "Oportunidades"]) {
    assert.match(home, new RegExp(word, "i"));
  }

  assert.doesNotMatch(
    styles,
    /nodeOne|nodeTwo|nodeThree|nodeFour|lineOne|lineTwo|lineThree/,
  );
  assert.match(direction, /composición editorial/);
  assert.match(
    direction,
    /Producción local, Tecnología aplicada y Vinculación empresarial/,
  );
  assert.match(direction, /segunda lista de sectores/);
});

test("equilibra el hero con una ilustración demostrativa del recorrido", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");
  const styles = await readProjectFile("src/features/home/HomePage.module.css");
  const direction = await readProjectFile("docs/direccion-visual-inicial.md");

  assert.match(home, /className=\{styles\.heroVisual\}/);
  assert.match(home, /aria-hidden="true"/);
  assert.match(home, /recorrido-descubrimiento-hero\.png/);
  assert.match(styles, /\.heroVisual/);
  assert.match(styles, /object-fit: cover/);
  assert.match(direction, /El recorrido que se revela/);
});
