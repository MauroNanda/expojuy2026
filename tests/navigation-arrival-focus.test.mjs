import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("traslada el foco al destino solo despues de una activacion con teclado", async () => {
  const arrival = await readProjectFile("src/navigation/NavigationArrival.tsx");

  assert.match(arrival, /useRef<"keyboard" \| "pointer">\("pointer"\)/);
  assert.match(arrival, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(arrival, /document\.addEventListener\("pointerdown", markPointer, true\)/);
  assert.match(
    arrival,
    /const shouldFocus = lastInteractionRef\.current === "keyboard";[\s\S]*?requestAnimationFrame\(/,
  );
  assert.match(
    arrival,
    /if \(shouldFocus\) \{[\s\S]*?focusTarget\.focus\(\{ preventScroll: true \}\);[\s\S]*?\}/,
  );
});
