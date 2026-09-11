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
  assert.match(page, /className="step-list"/);
  assert.match(page, /className="step-link"/);
  assert.match(page, /className="phase-count"/);
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
      assert.equal((block.match(/phase: "/g) ?? []).length, 7, "Verk 7 has seven checklist sections");
      assert.ok((block.match(/hint: "/g) ?? []).length >= 15, "Verk 7 explains its working steps with hints");
      continue;
    }
    assert.deepEqual(points, [6, 2, 2], `Project ${block.slice(0, 3)} has points ${points}`);
    assert.deepEqual(keys, ["easy", "medium", "hard"]);
  }
});

test("Verk 7 lists the presentation, three deliverables and peer evaluation as required steps", async () => {
  const data = await read("src/project-data.ts");
  const verk7 = data.slice(data.indexOf("number: 7,"), data.indexOf("number: 9,"));
  assert.match(verk7, /Kynnið þriðjudaginn 22\. september, 10–15 mínútur á hóp/);
  assert.match(verk7, /kennaratölvunni úr glæruskránni sem hópurinn skilaði í Canvas/);
  assert.match(verk7, /Skrifið rökstuðning, 3–5 setningar/);
  assert.match(verk7, /Þegar um 50 mínútur eru eftir/);
  for (const section of ["1 · Byrjið saman", "2 · Vinnið hlutana samtímis", "3 · Stoppið og athugið stöðuna", "4 · Gátlisti: skýrslan (PDF)", "5 · Gátlisti: vinnuskjölin (ZIP)", "6 · Gátlisti: glærusýningin", "7 · Skil, kynning og mat"]) {
    assert.ok(verk7.includes(`phase: "${section}"`), `section ${section}`);
  }
  assert.match(verk7, /„Jafningjamat Verk 7“ í Canvas eftir kynningarnar/);
  assert.match(verk7, /zip-möppu/);
  assert.match(verk7, /prófílmynd í Innu og Canvas/);
  assert.doesNotMatch(verk7, /pípulagnir, húsasmíði eða rafvirkjun/);
  assert.doesNotMatch(verk7, /groups:/);
  const rubric = verk7.slice(verk7.indexOf("rubric: ["), verk7.indexOf("gradeSplit: ["));
  assert.deepEqual([...rubric.matchAll(/grade: "([^"]+)"/g)].map((m) => m[1]), ["1–2", "3–4", "5–6", "7–8", "9–10"]);
  assert.match(verk7, /Ekki PDF/);
  assert.match(verk7, /Hlaða niður → Excel/);
  assert.match(verk7, /21\. september kl\. 23:59/);
  assert.match(verk7, /23\. september/);
  assert.doesNotMatch(verk7, /brennur yfir/);
  assert.equal((verk7.match(/grade: "50%"/g) ?? []).length, 2);
  assert.match(verk7, /Lokaeinkunn = helmingur hópeinkunnar/);
  assert.match(verk7, /reflectionUrl: "https:\/\/canvas.tskoli.is\/courses\/1907\/assignments\/30396"/);
  assert.match(verk7, /Engir skilahlekkir/);
  assert.match(verk7, /SUM af línusamtölum/);
  assert.match(verk7, /Rými B hefur engan glugga/);
});

test("the page offers a light theme and applies it before the first paint", async () => {
  const css = await read("src/globals.css");
  const html = await read("index.html");
  const page = await read("src/project-board.tsx");
  assert.match(css, /:root\[data-theme="light"\]/);
  assert.match(html, /localStorage\.getItem\("fagu-theme"\)/);
  assert.match(page, /className="theme-toggle"/);
});
