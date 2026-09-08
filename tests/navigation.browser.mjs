import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.BASE_URL || "http://127.0.0.1:5173/expojuy2026/";
try {
  for (const width of [1440, 375]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(base);
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    async function openNavigation() {
      const button = nav.getByRole("button", {
        name: "Abrir menú de navegación",
      });
      if (await button.isVisible()) await button.click();
    }
    async function checkTarget(id) {
      await page.waitForFunction((targetId) => {
        const target = document.getElementById(targetId);
        if (!target) return false;
        const bounds = target.getBoundingClientRect();
        const header = document.querySelector("header").getBoundingClientRect();
        return bounds.top >= header.bottom - 1 && bounds.top < innerHeight;
      }, id);
      const bounds = await page.locator(`#${id}`).boundingBox();
      const header = await page.locator("header").first().boundingBox();
      assert(
        bounds.y >= header.y + header.height - 1,
        `${id} hidden by header`,
      );
      assert(bounds.y < 900, `${id} outside viewport`);
      assert.equal(await nav.locator("details[open]").count(), 0);
    }
    await openNavigation();
    const homeIndex = nav.locator('summary[aria-label="Secciones de ExpoJuy"]');
    const closedHeaderHeight = await page
      .locator("header")
      .first()
      .evaluate((el) => el.getBoundingClientRect().height);
    await homeIndex.click();
    assert.equal(
      await page
        .locator("header")
        .first()
        .evaluate((el) => el.getBoundingClientRect().height),
      closedHeaderHeight,
    );
    const panelBounds = await homeIndex
      .locator("..")
      .locator("div")
      .first()
      .boundingBox();
    assert(panelBounds.x >= 0 && panelBounds.x + panelBounds.width <= width);
    assert.equal(
      await nav.getByText("Descubrí la Expo", { exact: true }).count(),
      1,
    );
    assert.equal(
      await nav.getByText("Prepará tu visita", { exact: true }).count(),
      1,
    );
    assert.equal(
      await nav.getByText("Institucional", { exact: true }).count(),
      1,
    );
    assert.equal(
      await nav.getByRole("link", { name: "Sectores", exact: true }).count(),
      1,
    );
    assert.equal(
      await nav.locator("summary").filter({ hasText: "Más" }).count(),
      0,
    );
    await page.mouse.click(2, 880);
    for (const [label, id] of [
      ["Sectores", "sectores"],
      ["Agenda destacada", "agenda"],
      ["Últimas noticias", "noticias"],
      ["Sponsors", "sponsors"],
      ["Contacto", "contacto"],
    ]) {
      for (const start of [base, `${base}agenda`]) {
        await page.goto(start);
        await openNavigation();
        await nav.locator('summary[aria-label="Secciones de ExpoJuy"]').click();
        await nav.getByRole("link", { name: label, exact: true }).click();
        await checkTarget(id);
      }
    }
    for (const [group, label, id] of [
      [
        "Secciones de ExpoJuy",
        "Protagonistas del Ecosistema",
        "polos-productivos",
      ],
      ["Secciones de ExpoJuy", "Conocé la Experiencia RA", "experiencia-ra"],
      ["Secciones de ExpoJuy", "Planificá tu visita", "planifica"],
      [
        "Subsecciones de Expositores",
        "Ruta de conexiones",
        "ruta-de-conexiones",
      ],
      ["Subsecciones de Noticias", "Canales oficiales", "canales-oficiales"],
    ]) {
      await openNavigation();
      const summary = nav.locator(`summary[aria-label="${group}"]`);
      await summary.click();
      await summary
        .locator("..")
        .getByRole("link", { name: label, exact: true })
        .click();
      await checkTarget(id);
    }
    await openNavigation();
    await nav.getByRole("button", { name: "Entradas", exact: true }).click();
    assert(
      await page
        .getByRole("dialog", { name: "Entradas", exact: true })
        .isVisible(),
    );
    await page.keyboard.press("Escape");
    for (const label of [
      "ExpoJuy",
      "Expositores",
      "Agenda",
      "Noticias",
      "Mapa",
      "Experiencia RA",
    ]) {
      await openNavigation();
      await nav.getByRole("link", { name: label, exact: true }).click();
      await page.getByRole("region", { name: label, exact: true }).waitFor();
    }
    await openNavigation();
    assert.equal(
      await nav.locator("summary").filter({ hasText: "Más" }).count(),
      0,
    );
    await page.goto(`${base}expositores#ruta-de-conexiones`);
    const actor = page.getByRole("button", { name: /Taller Quebrada/ });
    await actor.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const selectionScroll = await page.evaluate(() => window.scrollY);
    for (let repeat = 0; repeat < 2; repeat++) {
      await actor.click();
      await page.waitForTimeout(300);
      assert.equal(new URL(page.url()).hash, "#ruta-de-conexiones");
      assert(
        Math.abs(
          (await page.evaluate(() => window.scrollY)) - selectionScroll,
        ) < 3,
      );
    }
    console.log(`Navigation browser checks passed: ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
