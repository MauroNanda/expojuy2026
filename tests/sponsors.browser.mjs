import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [1440, 375]) {
    for (const count of [1, 7, 8]) {
      const variant = await browser.newPage({
        viewport: { width, height: 900 },
      });
      await variant.route("**/src/content/sponsors.ts*", async (route) => {
        const response = await route.fetch();
        const body = await response.text();
        await route.fulfill({
          response,
          body:
            body +
            `\nconst seed = [...sponsorReferences]; sponsorReferences.splice(0, sponsorReferences.length, ...Array.from({length:${count}}, (_, i) => ({...seed[i % seed.length], name: seed[i % seed.length].name + i})));`,
        });
      });
      await variant.goto("http://127.0.0.1:5173/expojuy2026/#sponsors");
      await variant.locator("#sponsors").waitFor();
      assert.equal(await variant.locator("#sponsors ul > li").count(), count);
      assert(
        await variant.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await variant.close();
    }
  }
  for (const width of [1440, 375]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto("http://127.0.0.1:5173/expojuy2026/#sponsors");
    const section = page.locator("#sponsors");
    assert.deepEqual(
      await page
        .locator("#sponsors")
        .evaluate((el) => [
          el.previousElementSibling?.id,
          el.nextElementSibling?.id,
        ]),
      ["planifica", "contacto"],
    );
    await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#sponsors img")].every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );
    assert.equal(await section.locator("img").count(), 6);
    assert.equal(await section.locator("a[href^='https:']").count(), 6);
    await page.reload();
    await page.waitForFunction(
      () => document.activeElement?.id === "sponsors-name",
    );
    assert.equal(
      await section.evaluate((el) => getComputedStyle(el).outlineStyle),
      "none",
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    console.log(
      width,
      await section
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.map((i) => [i.alt, i.naturalWidth, i.naturalHeight]),
        ),
    );
    await section.screenshot({
      path: `../.browser-tools/sponsors-${width}.png`,
    });
    const first = section.getByRole("link").first();
    await first.focus();
    assert(await first.evaluate((el) => el.matches(":focus-visible")));
    await section
      .getByRole("link", { name: "Ver información de contacto" })
      .click();
    await page.waitForFunction(
      () =>
        location.hash === "#contacto" &&
        document.activeElement?.id === "contact-name",
    );
    const contact = page.locator("#contacto");
    assert.equal(await contact.getByRole("heading", { level: 3 }).count(), 3);
    assert.equal(await contact.locator('a[href^="https:"]').count(), 3);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await contact.screenshot({
      path: `../.browser-tools/contact-${width}.png`,
    });
    await contact.getByRole("link", { name: "Planificá tu visita" }).click();
    await page.waitForFunction(
      () => document.activeElement?.id === "planning-name",
    );
    await page.close();
  }
  const page = await browser.newPage();
  await page.route("**/assets/sponsors/banco-comafi.jpg", (route) =>
    route.abort(),
  );
  await page.goto("http://127.0.0.1:5173/expojuy2026/#sponsors");
  await page.locator("#sponsors").scrollIntoViewIfNeeded();
  await page
    .locator("#sponsors")
    .getByText("Banco Comafi", { exact: true })
    .waitFor();
  console.log(
    "Sponsors: desktop, mobile, focus, contact and image fallback passed",
  );
} finally {
  await browser.close();
}
