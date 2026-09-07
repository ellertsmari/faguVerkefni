"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { defaultProjects, type Project } from "./project-data";

const levelGlyph = { easy: "01", medium: "02", hard: "03" } as const;
const storageKey = "fagu-verkefnabord-state";

type PersistedState = {
  selected?: number;
  openLevel?: string;
  checked?: Record<string, boolean>;
};

export default function ProjectBoard({ preview }: { preview?: Project }) {
  const [projects, setProjects] = useState<Project[]>(preview ? [preview] : defaultProjects);
  const [loadError, setLoadError] = useState(false);
  const [loaded, setLoaded] = useState(Boolean(preview));
  const [selected, setSelected] = useState(preview?.number ?? 7);
  const [openLevel, setOpenLevel] = useState<string>("easy");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(Boolean(preview));
  const [embedded, setEmbedded] = useState(Boolean(preview));
  const [locked, setLocked] = useState(Boolean(preview));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (preview) return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = Number(params.get("verk"));
    let restored: PersistedState | null = null;
    try {
      restored = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
    } catch {
      // Canvas embeds may block browser storage. Reading assignments still works.
    }
    // Browser-only preferences must be restored after hydration, including in Canvas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmbedded(window.self !== window.top);
    setLocked(window.self !== window.top || params.get("locked") === "1");
    if (defaultProjects.some((project) => project.number === fromUrl)) {
      setSelected(fromUrl);
    } else if (defaultProjects.some((project) => project.number === restored?.selected)) {
      setSelected(restored?.selected ?? 7);
    }
    const level = params.get("level") ?? restored?.openLevel;
    if (level && ["easy", "medium", "hard"].includes(level)) setOpenLevel(level);
    if (restored?.checked && typeof restored.checked === "object" && !Array.isArray(restored.checked)) {
      setChecked(restored.checked);
    }
    setHydrated(true);
  }, [preview]);

  useEffect(() => {
    if (preview) return;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Could not load projects");
        const data = await response.json() as { projects: Project[] };
        setProjects(data.projects);
        setLoadError(false);
        setLoaded(true);
      } catch {
        if (!controller.signal.aborted) setLoadError(true);
      }
    };
    void refresh();
    const interval = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 30000);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [preview]);

  useEffect(() => {
    if (!hydrated || preview) return;
    if (!locked) {
      const url = new URL(window.location.href);
      url.searchParams.set("verk", String(selected));
      url.searchParams.set("level", openLevel);
      window.history.replaceState({}, "", url);
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ selected, openLevel, checked }));
    } catch {
      // Only student checkmarks and navigation preferences are device-local.
    }
  }, [hydrated, locked, selected, openLevel, checked, preview]);

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

  const project = useMemo(() => preview ?? projects.find((item) => item.number === selected) ?? projects[0], [preview, projects, selected]);
  const activeLevel = project.levels.find((level) => level.key === openLevel) ?? project.levels[0];
  const activeLevelNumber = project.levels.findIndex((level) => level.key === activeLevel.key) + 1;
  const doneCount = activeLevel.steps.filter((_, index) => checked[`${project.number}-${activeLevel.key}-${index}`]).length;
  const totalCount = activeLevel.steps.length;

  const selectProject = (number: number) => {
    setSelected(number);
    setOpenLevel("easy");
    document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateOpenLevel = (level: string) => {
    setOpenLevel(level);
  };

  return (
    <main className={`site-shell${embedded ? " embedded" : ""}${locked ? " locked" : ""}`}>
      <canvas ref={canvasRef} className="ambient" aria-hidden="true" />
      {!hydrated || !loaded ? <div className="loading-project" role="status">{loadError ? <>Ekki tókst að sækja verkefnin. <button onClick={() => window.location.reload()}>Reyna aftur</button></> : "Hleð verkefni…"}</div> : <>
      {loadError && <p role="alert">Ekki tókst að athuga nýjustu breytingar. Síðan reynir aftur sjálfkrafa.</p>}
      <header className="topbar">
        <div className="brand"><span>FAGU</span><i /> {locked ? `VERK ${String(project.number).padStart(2, "0")}` : "STAFRÆNN VERKFÆRAKASSI"}</div>
        <div className="status"><b>{doneCount}</b> / {totalCount} SKREF · HLUTI {activeLevelNumber}</div>
      </header>

      {!locked && <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">VERKEFNABORÐ · HAUST 2026</p>
        <h1 id="page-title">Veldu hversu<br /><em>langt þú ferð.</em></h1>
        <p className="hero-copy">Byrjaðu á græna hlutanum. Bættu gulum og bláum við ef þú vilt meiri áskorun og fleiri stig.</p>
        <div className="rule-strip">
          <span><b>1 DAGUR</b> Verk 5, 6 og 8–12</span>
          <span><b>HÓPVERKEFNI</b> Verk 7 er kynnt sérstaklega</span>
          <span><b>6 + 2 + 2</b> Samtals 10 stig</span>
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
          {project.levels.map((level) => {
            const expanded = openLevel === level.key;
            return (
              <div className={`level-card ${level.key} ${expanded ? "expanded" : ""}`} key={level.key}>
                <button className="level-trigger" onClick={() => updateOpenLevel(level.key)} aria-expanded={expanded}>
                  <span className="level-number">{levelGlyph[level.key]}</span>
                  <span className="level-title"><small>{level.kicker}</small><b>{level.label}</b></span>
                  <span className="points">+{level.points} STIG</span>
                  <span className="toggle" aria-hidden="true">{expanded ? "−" : "+"}</span>
                </button>
                <div className="level-body" hidden={!expanded}>
                  <p className="task">{level.task}</p>
                  <ol>
                    {level.steps.map((step, index) => {
                      const key = `${project.number}-${level.key}-${index}`;
                      return (
                        <li key={key}>
                          <label>
                            <input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked((state) => ({ ...state, [key]: event.target.checked }))} />
                            <span>{step}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="deliverable"><small>AFHENDING ÚR ÞESSUM HLUTA</small><p>{level.deliverable}</p></div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="submission" aria-labelledby="submission-title">
          <div className="submission-mark" aria-hidden="true">↗</div>
          <div>
            <p className="eyebrow">SKILAÐU Í CANVAS</p>
            <h3 id="submission-title">Einn hluti eða allir þrír</h3>
            <p>Skilaðu <strong>Hluta 1 einum</strong> eða bættu við Hluta 2 og/eða Hluta 3. Settu allt í eitt Canvas-skil: eina PDF/ZIP-skrá, virkan hlekk eða texta og viðhengi. Merktu greinilega <b>Hluti 1</b>, <b>Hluti 2</b> og <b>Hluti 3</b>. Opnaðu skrár og hlekki áður en þú lýkur skilum.</p>
            {project.group && <p className="group-note">Einn nemandi skilar fyrir hópinn. Nöfn, ábyrgð og framlag allra þurfa að koma fram.</p>}
          </div>
          <a className="canvas-link" href={`https://canvas.tskoli.is/courses/1907/assignments/${project.canvasId}`} target={embedded ? "_top" : "_blank"} rel="noreferrer">SKILA VERK {project.number} Í CANVAS <span>↗</span></a>
        </section>
      </article>

      {!embedded && <footer>
        <span>FAGU · UPPLÝSINGATÆKNI</span>
        <a href="/teacher" target="_top">Kennaraaðgangur</a>
        <span>LÆRÐU · PRÓFAÐU · LAGAÐU · SKILAÐU</span>
      </footer>}
      </>}
    </main>
  );
}
