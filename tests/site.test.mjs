import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("collapsed project parts stay hidden despite grid layout", async () => {
  const css = await read("src/globals.css");
  assert.match(css, /\.level-body\[hidden\]\s*\{\s*display:\s*none;/);
});

test("static build contains the FAGU shell and its assets", async () => {
  const html = await read("dist/index.html");
  assert.match(html, /<title>FAGU · Stafrænn verkfærakassi<\/title>/);
  assert.match(html, /Hleð verkefni/);
  assert.match(html, /role="status"/);
  assert.match(html, /<html lang="is">/);
  // Assets must be referenced under the GitHub Pages sub-path.
  assert.match(html, /src="\/faguVerkefni\/assets\/[^"]+\.js"/);
  assert.match(html, /href="\/faguVerkefni\/assets\/[^"]+\.css"/);
  const guides = await readdir(new URL("dist/guides/", root));
  assert.deepEqual(guides.sort(), [
    "canvas-menu.png", "canvas-settings.png", "canvas-upload.png",
    "inna-menu.png", "inna-settings.png", "inna-upload.png",
  ]);
});

test("locks an embedded assignment to its requested project", async () => {
  const page = await read("src/project-board.tsx");
  assert.match(page, /window\.self !== window\.top/);
  assert.match(page, /params\.get\("locked"\) === "1"/);
  assert.match(page, /\{!locked && <nav className="project-nav"/);
  assert.match(page, /AÐEINS ÞETTA VERKEFNI ER SÝNT HÉR/);
  assert.match(page, /SKILA VERK \{project\.number\} Í CANVAS/);
});

test("keeps every project mapped to its Canvas assignment", async () => {
  const page = await read("src/project-board.tsx");
  const data = await read("src/project-data.ts");
  const expected = [[5, 24135], [6, 27490], [7, 24134], [8, 24136], [9, 24137], [10, 24138], [11, 24139], [12, 24140], [13, 24142]];
  for (const [number, canvasId] of expected) {
    assert.match(data, new RegExp(`number: ${number},[\\s\\S]*?canvasId: ${canvasId},`));
  }
  assert.equal((data.match(/number: \d+,/g) ?? []).length, expected.length);
  assert.equal((page.match(/AFHENDING ÚR ÞESSUM HLUTA/g) ?? []).length, 1);
  assert.match(page, /Einn hluti eða allir þrír/);
});

test("every project has three levels worth 6 + 2 + 2 points, except Verk 7 which is one part graded by quality", async () => {
  const data = await read("src/project-data.ts");
  const projectBlocks = data.split(/\n {2}\{\n {4}number: /).slice(1);
  assert.equal(projectBlocks.length, 9);
  for (const block of projectBlocks) {
    const points = [...block.matchAll(/points: (\d+)/g)].map((m) => Number(m[1]));
    const keys = [...block.matchAll(/key: "(easy|medium|hard)"/g)].map((m) => m[1]);
    if (/canvasId: 24134/.test(block)) {
      assert.deepEqual(points, [10]);
      assert.deepEqual(keys, ["easy"]);
      assert.equal((block.match(/hint: "/g) ?? []).length, 10, "Verk 7 carries a hint on every step");
      continue;
    }
    assert.deepEqual(points, [6, 2, 2], `Project ${block.slice(0, 3)} has points ${points}`);
    assert.deepEqual(keys, ["easy", "medium", "hard"]);
  }
});

test("Verk 7 lists the presentation, three deliverables and peer evaluation as required steps", async () => {
  const data = await read("src/project-data.ts");
  const verk7 = data.slice(data.indexOf("number: 7,"), data.indexOf("number: 9,"));
  assert.match(verk7, /flytjið hana á 3–4 mínútum mánudaginn 21\. september/);
  assert.match(verk7, /jafningjamat og sjálfsmat í Canvas eftir kynningarnar/);
  assert.match(verk7, /zip-skrá/);
  assert.match(verk7, /bæði í Innu og Canvas/);
  assert.doesNotMatch(verk7, /pípulagnir, húsasmíði eða rafvirkjun/);
  assert.doesNotMatch(verk7, /groups:/);
  assert.deepEqual([...verk7.matchAll(/grade: "([^"]+)"/g)].map((m) => m[1]), ["5–6", "7–8", "9–10"]);
  assert.match(verk7, /Helmingurinn er hópeinkunn/);
  assert.doesNotMatch(data, /peerEval/);
});

test("the page offers a light theme and applies it before the first paint", async () => {
  const css = await read("src/globals.css");
  const html = await read("index.html");
  const page = await read("src/project-board.tsx");
  assert.match(css, /:root\[data-theme="light"\]/);
  assert.match(html, /localStorage\.getItem\("fagu-theme"\)/);
  assert.match(page, /className="theme-toggle"/);
});
