import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  demoAgenda,
  demoAgendaPeriod,
  formatEventPeriod,
  officialChannels,
  officialEventPeriod,
  officialNews,
} from "../src/content/demoContent.ts";

const appRoot = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, appRoot), "utf8");
}

test("declares the confirmed event period as the single source of that date", async () => {
  assert.equal(officialEventPeriod.startDate, "2026-10-09");
  assert.equal(officialEventPeriod.endDate, "2026-10-12");
  assert.equal(officialEventPeriod.certainty, "confirmed");
});

test("never hardcodes the readable period in the interface", async () => {
  for (const path of [
    "src/features/home/HomePage.tsx",
    "src/features/agenda/AgendaPage.tsx",
    "src/content/demoContent.ts",
  ]) {
    const source = await readProjectFile(path);

    assert.doesNotMatch(
      source,
      /9 al 12 de octubre/,
      `${path} debe derivar el período y no escribirlo a mano`,
    );
  }
});

test("keeps the demonstrative programme distinct from the confirmed period", () => {
  assert.notEqual(demoAgendaPeriod.certainty, officialEventPeriod.certainty);
  assert.equal(demoAgendaPeriod.certainty, "demonstrative");
});

test("places every demonstrative activity inside the confirmed event period", () => {
  for (const activity of demoAgenda) {
    assert.ok(
      activity.date >= officialEventPeriod.startDate &&
        activity.date <= officialEventPeriod.endDate,
      `${activity.title} debe ubicarse dentro del período oficial del evento`,
    );
  }
});

test("derives the readable period from the confirmed dates", () => {
  assert.equal(formatEventPeriod(officialEventPeriod), "9 al 12 de octubre de 2026");
});

test("requires verifiable provenance on every news item", async () => {
  const content = await readProjectFile("src/content/demoContent.ts");

  assert.match(content, /export interface OfficialNewsItem/);
  assert.match(content, /source: OfficialNewsSource;/);
  assert.match(content, /retrievedDate: string;/);
  assert.doesNotMatch(content, /source\?: OfficialNewsSource/);

  assert.ok(officialNews.length > 0, "debe existir al menos una novedad");

  for (const item of officialNews) {
    assert.ok(item.source.name.length > 0, `${item.title} debe declarar su canal de origen`);
    assert.match(
      item.source.url,
      /^https:\/\//,
      `${item.title} debe enlazar a su publicación de origen`,
    );
    assert.match(item.publishedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.retrievedDate, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("orders news from most recent to oldest", () => {
  const dates = officialNews.map((item) => item.publishedDate);
  const sorted = [...dates].sort().reverse();

  assert.deepEqual(dates, sorted);
});

test("offers the official channels where updates are published", () => {
  assert.ok(officialChannels.length > 0);

  for (const channel of officialChannels) {
    assert.ok(channel.name.length > 0);
    assert.match(channel.url, /^https:\/\//);
  }
});

test("presents news at the existing route instead of a pending entry point", async () => {
  const app = await readProjectFile("src/app/App.tsx");

  assert.match(app, /NewsPage/);
  assert.match(app, /routePaths\.news/);
  assert.doesNotMatch(app, /EntryPage/);
});

test("states that news are not incorporated automatically", async () => {
  const page = await readProjectFile("src/features/news/NewsPage.tsx");

  const text = page.replace(/\s+/g, " ");

  assert.match(text, /no se incorporan de forma automática/);
  assert.match(text, /Se abre en un sitio externo/);
});

test("does not consume social platforms, credentials or third party scripts", async () => {
  const page = await readProjectFile("src/features/news/NewsPage.tsx");
  const content = await readProjectFile("src/content/demoContent.ts");

  for (const source of [page, content]) {
    assert.doesNotMatch(source, /fetch\(/);
    assert.doesNotMatch(source, /access_token|graph\.instagram|graph\.facebook/);
    assert.doesNotMatch(source, /<script/);
  }
});

test("marks institutional data the organisation has not provided", async () => {
  const pending = await readProjectFile("src/shared/ui/PendingData.tsx");
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(pending, /Dato a confirmar/);
  assert.match(home, /PendingData/);
});

test("communicates the confirmed period from the home page", async () => {
  const home = await readProjectFile("src/features/home/HomePage.tsx");

  assert.match(home, /formatEventPeriod/);
  assert.match(home, /officialEventPeriod/);
});
