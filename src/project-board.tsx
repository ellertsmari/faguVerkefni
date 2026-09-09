import { useEffect, useRef, useState } from "react";

import { defaultProjects, stepText, type Level } from "./project-data";
import PhotoGuide from "./photo-guide";

const levelGlyph = { easy: "01", medium: "02", hard: "03" } as const;
const levelKeys: Level["key"][] = ["easy", "medium", "hard"];
const storageKey = "fagu-verkefnabord-state-v2";
const themeKey = "fagu-theme";

type Theme = "dark" | "light";

// index.html applies the same rule before the first paint so there is no flash.
function initialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(themeKey);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage may be blocked; fall through to the system preference.
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
const canvasCourse = "https://canvas.tskoli.is/courses/1907/assignments/";
const projects = defaultProjects;

type PersistedState = {
  selected?: number;
  openLevel?: string;
  checked?: Record<string, boolean>;
};

function readPersistedState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as PersistedState) : {};
  } catch {
    // Canvas embeds may block browser storage. Reading assignments still works.
    return {};
  }
}

function isLevelKey(value: string | null | undefined): value is Level["key"] {
  return levelKeys.includes(value as Level["key"]);
}

// Everything here runs in the browser only, so the initial state can be
// derived synchronously from the URL and browser storage.
function initialState() {
  const params = new URLSearchParams(window.location.search);
  const restored = readPersistedState();
  const embedded = window.self !== window.top;
  const fromAssignment = params.has("assignment")
    ? projects.find((project) => project.canvasId === Number(params.get("assignment")))
    : undefined;
  const fromUrl = fromAssignment?.number ?? Number(params.get("verk"));
  const selected = projects.some((project) => project.number === fromUrl)
    ? fromUrl
    : projects.some((project) => project.number === restored.selected)
      ? (restored.selected as number)
      : 7;
  const levelParam = params.get("level") ?? restored.openLevel;
  const openLevel: Level["key"] = isLevelKey(levelParam) ? levelParam : "easy";
  const checked = restored.checked && typeof restored.checked === "object" && !Array.isArray(restored.checked)
    ? restored.checked
    : {};
  return {
    selected,
    openLevel,
    checked,
    embedded,
    locked: embedded || params.get("locked") === "1",
  };
}

export default function ProjectBoard() {
  const [initial] = useState(initialState);
  const { embedded, locked } = initial;
  const [selected, setSelected] = useState(initial.selected);
  const [openLevel, setOpenLevel] = useState<Level["key"]>(initial.openLevel);
  const [checked, setChecked] = useState<Record<string, boolean>>(initial.checked);
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(themeKey, theme);
    } catch {
      // The choice then lasts for this page load only.
    }
  }, [theme]);

  useEffect(() => {
    if (!locked) {
      const url = new URL(window.location.href);
      url.searchParams.delete("assignment");
      url.searchParams.set("verk", String(selected));
      url.searchParams.set("level", openLevel);
      window.history.replaceState({}, "", url);
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ selected, openLevel, checked }));
    } catch {
      // Only student checkmarks and navigation preferences are device-local.
    }
  }, [locked, selected, openLevel, checked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let raf = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(111, 198, 255, .11)";
      context.lineWidth = 1;
      for (let y = 80; y < height; y += 160) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      for (let x = 80; x < width; x += 160) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      const travel = reduce ? width * 0.6 : (frame * 0.7) % (width + 240) - 120;
      const glow = context.createRadialGradient(travel, height * 0.34, 0, travel, height * 0.34, 120);
      glow.addColorStop(0, "rgba(85, 182, 255, .13)");
      glow.addColorStop(1, "rgba(85, 182, 255, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      frame += 1;
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const project = projects.find((item) => item.number === selected) ?? projects[0];
  const single = project.levels.length === 1;
  const activeLevel = project.levels.find((level) => level.key === openLevel) ?? project.levels[0];
  const activeLevelNumber = project.levels.findIndex((level) => level.key === activeLevel.key) + 1;
  const doneCount = activeLevel.steps.filter((_, index) => checked[`${project.number}-${activeLevel.key}-${index}`]).length;
  const totalCount = activeLevel.steps.length;

  const selectProject = (number: number) => {
    setSelected(number);
    setOpenLevel("easy");
    document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={`site-shell${embedded ? " embedded" : ""}${locked ? " locked" : ""}`}>
      <canvas ref={canvasRef} className="ambient" aria-hidden="true" />
      <header className="topbar">
        <div className="brand"><span>FAGU</span><i /> {locked ? `VERK ${String(project.number).padStart(2, "0")}` : "STAFRÆNN VERKFÆRAKASSI"}</div>
        <div className="topbar-right">
          <div className="status"><b>{doneCount}</b> / {totalCount} SKREF{single ? "" : ` · HLUTI ${activeLevelNumber}`}</div>
          <button type="button" className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Skipta í ljóst þema" : "Skipta í dökkt þema"} title={theme === "dark" ? "Ljóst þema" : "Dökkt þema"}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

      {!locked && <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">VERKEFNABORÐ · HAUST 2026</p>
        <h1 id="page-title">Veldu hversu<br /><em>langt þú ferð.</em></h1>
        <p className="hero-copy">Byrjaðu á græna hlutanum. Bættu gulum og bláum við ef þú vilt meiri áskorun og fleiri stig.</p>
        <div className="rule-strip">
          <span><b>1 DAGUR</b> Verk 5, 6 og 8–13</span>
          <span><b>HÓPVERKEFNI</b> Verk 7 er ein heild, metin eftir gæðum</span>
          <span><b>6 + 2 + 2</b> Samtals 10 stig í hinum</span>
        </div>
      </section>}

      {!locked && <nav className="project-nav" aria-label="Veldu verkefni">
        {projects.map((item) => (
          <button key={item.number} className={item.number === selected ? "active" : ""} onClick={() => selectProject(item.number)} aria-current={item.number === selected ? "page" : undefined}>
            <span>{String(item.number).padStart(2, "0")}</span>
            <b>{item.title}</b>
          </button>
        ))}
      </nav>}

      <article className="project" id="project" key={project.number}>
        {locked && <p className="context-note">ÞÚ ERT Í VERK {project.number} · AÐEINS ÞETTA VERKEFNI ER SÝNT HÉR</p>}
        <div className="project-heading">
          <div className="project-index">VERK {String(project.number).padStart(2, "0")}</div>
          <div>
            <p className="eyebrow">{project.group ? "HÓPVERKEFNI" : "EIN VINNULOTA"}</p>
            <h2>{project.title}</h2>
            <p>{project.intro}</p>
          </div>
        </div>

        <div className="meta-grid">
          <div><small>VERKFÆRI</small><p>{project.tools}</p></div>
          <div><small>AI-REGLA</small><p>{project.ai}</p></div>
        </div>

        <section className="levels" aria-label="Verkefnahlutar">
          {single
            ? <p>Eitt verkefni, tíu skref, einkunn 0–10. Hakaðu við skrefin jafnóðum. Það sem ræður einkunninni er hversu vel er vandað til verksins, sjá Einkunn neðar á síðunni.</p>
            : <p>Byrjaðu á Hluta 1 (6 stig). Hlutar 2 og 3 eru valfrjáls viðbót, 2 stig hvor. Samtals 10 stig.</p>}
          {project.scenario && <aside className="scenario"><h3>Aðstæður: lestu þetta fyrst</h3><p>{project.scenario}</p></aside>}
          {project.levels.map((level) => {
            const expanded = single || openLevel === level.key;
            return (
              <div className={`level-card ${level.key} ${expanded ? "expanded" : ""}${single ? " single" : ""}`} key={level.key}>
                {single
                  ? <div className="level-trigger">
                      <span className="level-number">{levelGlyph[level.key]}</span>
                      <span className="level-title"><small>{level.kicker}</small><b>{level.label}</b></span>
                      <span className="points">0–{level.points} EFTIR GÆÐUM</span>
                    </div>
                  : <button className="level-trigger" onClick={() => setOpenLevel(level.key)} aria-expanded={expanded}>
                      <span className="level-number">{levelGlyph[level.key]}</span>
                      <span className="level-title"><small>{level.kicker}</small><b>{level.label}</b></span>
                      <span className="points">+{level.points} STIG</span>
                      <span className="toggle" aria-hidden="true">{expanded ? "−" : "+"}</span>
                    </button>}
                <div className="level-body" hidden={!expanded}>
                  <p className="task">{level.task}</p>
                  <ol>
                    {level.steps.map((step, index) => {
                      const key = `${project.number}-${level.key}-${index}`;
                      const hint = typeof step === "string" ? null : step;
                      const hintOpen = Boolean(openHints[key]);
                      return (
                        <li key={key}>
                          <div className="step-row">
                            <label>
                              <input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked((state) => ({ ...state, [key]: event.target.checked }))} />
                              <span>{stepText(step)}</span>
                            </label>
                            {hint && <button type="button" className="hint-toggle" aria-expanded={hintOpen} aria-controls={`hint-${key}`} aria-label={hintOpen ? "Fela vísbendingu" : "Sýna vísbendingu"} onClick={() => setOpenHints((state) => ({ ...state, [key]: !hintOpen }))}>?</button>}
                          </div>
                          {hint && <div className="hint" id={`hint-${key}`} hidden={!hintOpen}>
                            <p>{hint.hint}</p>
                            {hint.link && <a href={hint.link.url} target="_blank" rel="noreferrer">{hint.link.label} ↗</a>}
                          </div>}
                        </li>
                      );
                    })}
                  </ol>
                  <div className="deliverable"><small>{single ? "ÞAÐ SEM ÞARF AÐ SKILA" : "AFHENDING ÚR ÞESSUM HLUTA"}</small><p>{level.deliverable}</p></div>
                </div>
              </div>
            );
          })}
        </section>

        {project.photoGuide && <PhotoGuide />}

        {(project.rubric || project.assessment) && <section className="assessment" aria-labelledby="assessment-title">
          <p className="eyebrow">EINKUNN</p>
          <h3 id="assessment-title">Hvað gefur hvaða einkunn</h3>
          {project.rubric && <div className="rubric">
            {project.rubric.map((band, index) => (
              <div className={`rubric-band b${index + 1}`} key={band.grade}>
                <b>{band.grade}</b>
                <strong>{band.title}</strong>
                <p>{band.text}</p>
              </div>
            ))}
          </div>}
          {project.assessment?.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </section>}

        <section className="submission" aria-labelledby="submission-title">
          <div className="submission-mark" aria-hidden="true">↗</div>
          <div>
            <p className="eyebrow">SKILAÐU Í CANVAS</p>
            <h3 id="submission-title">{single ? "Þrjár skrár, ein skil" : "Einn hluti eða allir þrír"}</h3>
            {project.submission ? <p className="submission-text">{project.submission}</p> : <p>Skilaðu <strong>Hluta 1 einum</strong> eða bættu við Hluta 2 og/eða Hluta 3. Settu allt í eitt Canvas-skil: eina PDF/ZIP-skrá, virkan hlekk eða texta og viðhengi. Merktu greinilega <b>Hluti 1</b>, <b>Hluti 2</b> og <b>Hluti 3</b>. Opnaðu skrár og hlekki áður en þú lýkur skilum.</p>}
            {project.group && <p className="group-note">Einn nemandi skilar fyrir hópinn. Nöfn, ábyrgð og framlag allra þurfa að koma fram.</p>}
          </div>
          <a className="canvas-link" href={`${canvasCourse}${project.canvasId}`} target={embedded ? "_top" : "_blank"} rel="noreferrer">SKILA VERK {project.number} Í CANVAS <span>↗</span></a>
        </section>
      </article>

      {!embedded && <footer>
        <span>FAGU · UPPLÝSINGATÆKNI</span>
        <span>LÆRÐU · PRÓFAÐU · LAGAÐU · SKILAÐU</span>
      </footer>}
    </main>
  );
}
