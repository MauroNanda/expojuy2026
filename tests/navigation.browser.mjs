// Run with PLAYWRIGHT_MODULE pointing to an external Playwright installation,
// or with Playwright available locally. Start Vite before running this script.
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
        const label = document.getElementById(
          target?.getAttribute("aria-labelledby")?.split(/\s+/)[0] || "",
        );
        return (
          document.activeElement ===
          (label && target.contains(label) ? label : target)
        );
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
    for (const group of [
      "Secciones de ExpoJuy",
      "Subsecciones de Expositores",
      "Subsecciones de Noticias",
    ]) {
      await nav.locator(`summary[aria-label="${group}"]`).click();
      assert.equal(await nav.locator("details[open]").count(), 1);
    }
    await page.mouse.click(2, 880);
    assert.equal(await nav.locator("details[open]").count(), 0);
    for (const [label, id] of [
      ["Sectores", "sectores"],
      ["Sponsors", "sponsors"],
      ["Contacto", "contacto"],
    ]) {
      for (const start of [base, `${base}agenda`]) {
        await page.goto(start);
        await openNavigation();
        if (label !== "Sectores")
          await nav.locator("summary").filter({ hasText: "Más" }).click();
        await nav
          .getByRole("link", { name: label, exact: true })
          .filter({ visible: true })
          .click();
        await checkTarget(id);
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await openNavigation();
        if (label !== "Sectores")
          await nav.locator("summary").filter({ hasText: "Más" }).click();
        await nav
          .getByRole("link", { name: label, exact: true })
          .filter({ visible: true })
          .click();
        await checkTarget(id);
      }
    }
    for (const [group, label, id] of [
      [
        "Secciones de ExpoJuy",
        "Protagonistas del Ecosistema",
        "polos-productivos",
      ],
      ["Secciones de ExpoJuy", "Agenda", "agenda"],
      ["Secciones de ExpoJuy", "Experiencia RA", "experiencia-ra"],
      ["Secciones de ExpoJuy", "Noticias", "noticias"],
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
      await nav
        .getByRole("link", { name: label, exact: true })
        .filter({ visible: true })
        .click();
      await page.getByRole("region", { name: label, exact: true }).waitFor();
      assert(
        await page
          .getByRole("region", { name: label, exact: true })
          .isVisible(),
      );
    }
    await openNavigation();
    const more = nav.locator("summary").filter({ hasText: "Más" });
    await more.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
    assert(
      await more.evaluate((element) => element === document.activeElement),
    );
    assert.equal(await nav.locator("details[open]").count(), 0);
    console.log(`Navigation browser checks passed: ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
