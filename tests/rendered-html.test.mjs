import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server renders the FAGU shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>FAGU · Stafrænn verkfærakassi<\/title>/i);
  assert.match(html, /Hleð verkefni/);
  assert.match(html, /role="status"/);
  assert.doesNotMatch(html, /codex-preview/i);
});

test("locks an embedded assignment to its requested project", async () => {
  const page = await readFile(new URL("../app/project-board.tsx", import.meta.url), "utf8");
  assert.match(page, /window\.self !== window\.top/);
  assert.match(page, /params\.get\("locked"\) === "1"/);
  assert.match(page, /\{!locked && <nav className="project-nav"/);
  assert.match(page, /AÐEINS ÞETTA VERKEFNI ER SÝNT HÉR/);
  assert.match(page, /SKILA VERK \{project\.number\} Í CANVAS/);
});

test("keeps every redesigned project mapped to its Canvas assignment", async () => {
  const page = await readFile(new URL("../app/project-board.tsx", import.meta.url), "utf8");
  const data = await readFile(new URL("../app/project-data.ts", import.meta.url), "utf8");
  for (const [number, canvasId] of [[5, 24135], [6, 27490], [7, 24134], [8, 24136], [9, 24137], [10, 24138], [11, 24139], [12, 24140], [13, 24142]]) {
    assert.match(data, new RegExp(`number: ${number},[\\s\\S]*?canvasId: ${canvasId},`));
  }
  assert.equal((page.match(/AFHENDING ÚR ÞESSUM HLUTA/g) ?? []).length, 1);
  assert.match(page, /Einn hluti eða allir þrír/);
});
