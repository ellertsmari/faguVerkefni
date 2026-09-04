"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Level = {
  key: "easy" | "medium" | "hard";
  label: string;
  kicker: string;
  points: number;
  task: string;
  steps: string[];
  deliverable: string;
};

type Project = {
  number: number;
  title: string;
  intro: string;
  tools: string;
  ai: string;
  canvasId: number;
  group?: boolean;
  levels: Level[];
};

const projects: Project[] = [
  {
    number: 5,
    title: "Myndaskýrsla og PDF",
    intro: "Sýndu hvað var skoðað eða lagað þannig að viðskiptavinur skilji verkið án munnlegrar útskýringar.",
    tools: "Sími eða myndavél · myndmerking · Word, Docs eða glærur · PDF",
    ai: "AI 0 — Ekki hlaða myndum af fólki eða vinnustað í AI.",
    canvasId: 24135,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Búðu til stutta og læsilega myndaskýrslu.", steps: ["Veldu 3 öruggar og leyfilegar myndir.", "Raðaðu þeim í rökrétta röð.", "Skrifaðu 1–2 setninga myndatexta við hverja mynd.", "Flyttu skjalið út sem PDF og opnaðu það til að prófa."], deliverable: "Ein PDF-skrá með 3 myndum, myndatextum og lýsandi skráarheiti." },
      { key: "medium", label: "Miðlungs", kicker: "Skýrari sönnun", points: 2, task: "Gerðu mikilvægu atriðin auðveld að finna.", steps: ["Bættu örvum, hringjum eða númerum við að minnsta kosti 2 myndir.", "Settu stuttan titil og dagsetningu á skýrsluna.", "Athugaðu að engar persónuupplýsingar sjáist."], deliverable: "Uppfærð PDF þar sem merkingar benda skýrt á það sem þú ert að útskýra." },
      { key: "hard", label: "Erfitt", kicker: "Fagleg afhending", points: 2, task: "Láttu skýrsluna segja heila sögu um verkið.", steps: ["Notaðu 4–5 myndir sem sýna yfirlit, smáatriði og niðurstöðu.", "Skrifaðu stutta niðurstöðu: hvað var gert og hvað þarf að gerast næst.", "Biddu annan nemanda að lesa skýrsluna án útskýringar og lagfærðu eitt óskýrt atriði."], deliverable: "Loka-PDF ásamt einni setningu í Canvas um breytinguna sem þú gerðir eftir prófun." },
    ],
  },
  {
    number: 6,
    title: "Fagleg samskipti",
    intro: "Viðskiptavinur sendir óskýra beiðni. Svaraðu kurteislega, fáðu upplýsingarnar sem vantar og forðastu óraunhæf loforð.",
    tools: "Canvas textaskil eða tölvupóstsdrög · PDF eða annað tilbúið viðhengi",
    ai: "AI 1 — AI má hjálpa við málfar, en ekki setja inn nöfn, netföng eða persónuupplýsingar.",
    canvasId: 24136,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Skrifaðu svar við óskýru erindi Jóns.", steps: ["Settu skýra efnislínu.", "Notaðu ávarp og staðfestu hvað þú skilur úr erindinu.", "Spyrðu 2–3 skýrra spurninga um verð, umfang eða tímasetningu.", "Ljúktu með næsta skrefi og kveðju."], deliverable: "Texti tölvupósts með efnislínu, ávarpi, meginmáli og kveðju." },
      { key: "medium", label: "Miðlungs", kicker: "Betri afhending", points: 2, task: "Veldu rétt fylgigagn og hafðu það auðþekkjanlegt.", steps: ["Veldu skrá sem styður erindið eða búðu til tilbúið sýnishorn.", "Gefðu skránni lýsandi heiti.", "Nefndu viðhengið í tölvupóstinum og segðu hvað það inniheldur."], deliverable: "Tölvupóstsdrögin og rétt nefnt viðhengi eða skjámynd af því." },
      { key: "hard", label: "Erfitt", kicker: "Viðskiptavinapróf", points: 2, task: "Prófaðu hvort annar aðili geti brugðist rétt við.", steps: ["Fáðu jafningja til að lesa svarið sem viðskiptavinur.", "Skráðu eitt sem var óskýrt eða vantaði.", "Bættu svarið án þess að lofa verði eða tíma sem þú getur ekki staðið við."], deliverable: "Lokaútgáfa og tvær stuttar línur: hvað var óskýrt og hvað breyttist." },
    ],
  },
  {
    number: 7,
    title: "Hannaðu snjallt vinnurými",
    intro: "Hópurinn breytir auðu rými í nothæft verkstæði með grunnmynd, kostnaðaráætlun og prófaðri LED-merkiljósarás.",
    tools: "Stafrænt teikniforrit · töflureiknir · Falstad · sameiginlegt skjal",
    ai: "AI 1 — AI má hjálpa með eina spurningu; hópurinn þarf að sannreyna svarið í herminum.",
    canvasId: 24134,
    group: true,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Sameiginleg grunnlausn", points: 6, task: "Setjið saman eina lausn sem sýnir rými, kostnað og rafrás.", steps: ["Skráið nöfn og ábyrgð allra í hópnum.", "Teiknið læsilega grunnmynd með málum, hurð, glugga, borði, hillu og gönguleið.", "Reiknið flatarmál og heildarkostnað með 10% viðbót.", "Smíðið LED-rás í Falstad og takið skjámynd þar sem ljósið logar."], deliverable: "Eitt hópskjal með ábyrgðarskrá, grunnmynd, sýndum reikningum og skjámynd af virkri LED-rás." },
      { key: "medium", label: "Miðlungs", kicker: "Prófið lausnina", points: 2, task: "Sýnið að niðurstöðurnar þoli breytingar og yfirferð.", steps: ["Notið formúlur þannig að kostnaður uppfærist þegar ein tala breytist.", "Merkið spennugjafa, LED og viðnám á rásarmyndinni.", "Skráið eina villu eða breytingu sem hópurinn fann við prófun."], deliverable: "Uppfært hópskjal með formúlusönnun, merktri rás og einni skráðri lagfæringu." },
      { key: "hard", label: "Erfitt", kicker: "Verkstjórnaráskorun", points: 2, task: "Rökstyðjið lausnina og sýnið sannanlegt framlag allra.", steps: ["Spyrjið AI eina afmarkaða spurningu um rás eða viðnám.", "Sannreynið svarið í Falstad og skráið hvað stóðst eða breyttist.", "Kynnið lausnina á 3–4 mínútum; allir tala og geta svarað spurningu."], deliverable: "Skjámynd af AI-spurningu og svari, 2 setninga sannprófun og stutt framlagsskrá hópsins." },
    ],
  },
  {
    number: 8,
    title: "AI-notkun og sannprófun",
    intro: "AI svarar hratt en getur haft rangt fyrir sér. Prófaðu svar, finndu veikleika og taktu sjálfstæða afstöðu.",
    tools: "Microsoft Copilot með skólareikningi · reiknivél · opinber eða traust heimild",
    ai: "AI 2 — AI er krafist, en persónugreinanleg gögn eru bönnuð og allar niðurstöður þarf að sannreyna.",
    canvasId: 24137,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Spyrðu AI um eitt afmarkað hagnýtt verkefni.", steps: ["Notaðu tilbúið eða afpersónugreint dæmi.", "Vistaðu spurninguna og svarið.", "Merktu tvær fullyrðingar sem þarf að athuga.", "Sannreyndu aðra með útreikningi, prófun eða traustri heimild."], deliverable: "Prompt, AI-svar og ein sýnileg sannprófun með heimild eða útreikningi." },
      { key: "medium", label: "Miðlungs", kicker: "Tvöföld athugun", points: 2, task: "Sannreyndu báðar mikilvægu fullyrðingarnar.", steps: ["Notaðu óháða aðferð fyrir seinni fullyrðinguna.", "Skráðu heimildarslóð, útreikning eða prófunarniðurstöðu.", "Segðu hvað í AI-svarinu þarf að laga."], deliverable: "Tvær skýrt merktar sannprófanir og leiðrétt útgáfa af niðurstöðunni." },
      { key: "hard", label: "Erfitt", kicker: "Betri spurning", points: 2, task: "Bættu spurninguna og berðu niðurstöðurnar saman.", steps: ["Endurskrifaðu promptið með skýrari forsendum.", "Berðu saman fyrra og seinna svarið.", "Veldu: treysta, laga eða hafna — og rökstyddu ákvörðunina."], deliverable: "Bæði promptin, stuttur samanburður og rökstudd lokaákvörðun." },
    ],
  },
  {
    number: 9,
    title: "Vefveiðar og stafrænt öryggi",
    intro: "Greindu tilbúin svikaskilaboð án þess að opna grunsamlega hlekki og settu upp öruggt viðbragðsferli.",
    tools: "Sýnidæmin í Canvas · vafri án þess að opna grunsamlegar slóðir",
    ai: "AI 0 — Ekki setja grunsamleg skilaboð eða raunveruleg gögn í AI.",
    canvasId: 24138,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Finndu viðvörunarmerkin í sýnidæmunum.", steps: ["Merktu að minnsta kosti 5 viðvörunarmerki.", "Tengdu hvert merki við sendanda, slóð, þrýsting eða gagnabeiðni.", "Flokkaðu hvert sýni: líklegt, óvíst eða svik.", "Skrifaðu 4 örugg skref sem þú myndir taka."], deliverable: "Merkt greining á sýnunum og fjögurra skrefa viðbragðsferli." },
      { key: "medium", label: "Miðlungs", kicker: "Verndaðu aðganginn", points: 2, task: "Útskýrðu hvernig góður aðgangur dregur úr tjóni.", steps: ["Búðu til tilbúna sterka aðgangssetningu — ekki raunverulegt lykilorð.", "Útskýrðu 2FA með eigin orðum.", "Segðu hvað þú gerir ef þú slóst þegar inn lykilorð."], deliverable: "Dæmi um tilbúna aðgangssetningu og þrjár stuttar öryggisskýringar." },
      { key: "hard", label: "Erfitt", kicker: "Öryggisspjald", points: 2, task: "Gerðu leiðbeiningar sem samstarfsfólk getur notað.", steps: ["Settu viðvörunarmerkin og viðbragðsferlið á eina síðu.", "Bættu við öruggri staðfestingu eftir annarri samskiptaleið.", "Prófaðu spjaldið á jafningja og lagfærðu eitt atriði."], deliverable: "Einnar síðu öryggisspjald sem PDF eða mynd, ásamt einni skráðri lagfæringu." },
    ],
  },
  {
    number: 10,
    title: "Tilboð, tímaskrá og PDF",
    intro: "Búðu til skriflegt tilboð þar sem efni, vinna, forsendur, VSK og heildarverð stemma.",
    tools: "Excel eða Sheets · tilboðssniðmát · PDF · tímaskrá",
    ai: "AI 1 — AI má hjálpa við orðalag forsendna; tölur og formúlur þarf að sannprófa sjálfstætt.",
    canvasId: 24139,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Fylltu út grunninn að tilboði sem hægt er að yfirfara.", steps: ["Skráðu verkumfang, efni, magn, verð og vinnustundir.", "Notaðu formúlur fyrir samtölur.", "Sýndu heild án og með VSK.", "Settu rétta dagsetningu og flyttu út sem PDF."], deliverable: "Útfyllt reikniskjal og ein PDF-skrá með efni, vinnu og réttum samtölum." },
      { key: "medium", label: "Miðlungs", kicker: "Tölurnar stemma", points: 2, task: "Tengdu vinnukostnaðinn við tímaskrá.", steps: ["Búðu til einfalda tímaskrá.", "Láttu vinnustundir og tímagjald passa við tilboðið.", "Skráðu 2 forsendur og eitt sem er ekki innifalið."], deliverable: "Tímaskrá og uppfært tilboð þar sem vinnuliðurinn stemmir og forsendur sjást." },
      { key: "hard", label: "Erfitt", kicker: "Breytingapróf", points: 2, task: "Sýndu að skjalið þoli breytingu án handreiknings.", steps: ["Breyttu einu magni eða einu verði.", "Athugaðu að samtölur og VSK uppfærist sjálfkrafa.", "Yfirfarðu nafn, dagsetningu, gildistíma og allar upphæðir."], deliverable: "Loka-PDF og skjámynd af formúlu eða breytingaprófi sem sýnir að útreikningar uppfærast." },
    ],
  },
  {
    number: 11,
    title: "Einföld 3D-hönnun",
    intro: "Hannaðu festihlut, merkiplötu eða millistykki sem leysir eitt mælanlegt vandamál í verkstæði.",
    tools: "Tinkercad 3D, Onshape Education eða annað samþykkt CAD-verkfæri",
    ai: "AI 1 — AI má hjálpa við verkfæraaðgerðir; líkanið þarf sjálft að standast mælanlegar kröfur.",
    canvasId: 24140,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Byggðu einfalt hagnýtt líkan með nákvæmum stærðum.", steps: ["Skrifaðu 3 mælanlegar kröfur.", "Notaðu að minnsta kosti 3 form eða aðgerðir.", "Haltu líkaninu innan 150 × 150 × 150 mm og veggþykkt í minnst 3 mm.", "Taktu skjámynd þar sem málsetningar sjást."], deliverable: "Skjámynd af líkaninu með sýnilegum málum og stutt lýsing á notkun þess." },
      { key: "medium", label: "Miðlungs", kicker: "Notanlegt líkan", points: 2, task: "Bættu við smáatriði sem styður raunverulega notkun.", steps: ["Bættu við gati, texta eða samsetningu.", "Athugaðu að breytingin eyðileggi ekki grunnformið.", "Flyttu út STL/OBJ eða búðu til deilanlegan hlekk."], deliverable: "STL/OBJ-skrá eða deilanlegur hlekkur ásamt uppfærðri skjámynd." },
      { key: "hard", label: "Erfitt", kicker: "Passar þetta?", points: 2, task: "Prófaðu líkanið gegn eigin kröfum.", steps: ["Mældu líkanið gegn öllum 3 kröfunum.", "Útskýrðu eina takmörkun eða mögulega bilun.", "Gerðu eina breytingu sem bætir styrk, passun eða framleiðanleika."], deliverable: "Stutt prófunartafla með 3 kröfum og lokaútgáfa sem sýnir eina rökstudda breytingu." },
    ],
  },
  {
    number: 12,
    title: "Ferilskrá og stafrænn vinnumappi",
    intro: "Sýndu á einni síðu hver þú ert sem nemi og veldu sönnunargögn sem sýna hvað þú getur.",
    tools: "Word, Google Docs eða Canva · PDF · verkefnamappa",
    ai: "AI 1 — AI má hjálpa við orðalag; engin viðkvæm gögn í AI og allt í ferilskránni þarf að vera satt.",
    canvasId: 24142,
    levels: [
      { key: "easy", label: "Auðvelt", kicker: "Örugg byrjun", points: 6, task: "Búðu til skýra og sanna einnar síðu ferilskrá.", steps: ["Settu nafn, tengiliðaupplýsingar sem þú mátt deila, nám og viðeigandi reynslu.", "Veldu 4–6 hæfniatriði sem tengjast iðngreininni.", "Notaðu læsilega uppsetningu og samræmt málfar.", "Flyttu út sem PDF og opnaðu skrána."], deliverable: "Einnar síðu ferilskrá sem PDF með faglegu skráarheiti." },
      { key: "medium", label: "Miðlungs", kicker: "Sýndu sönnun", points: 2, task: "Veldu verk sem sýna ólíka hæfni.", steps: ["Veldu 3 verkefni úr áfanganum.", "Skráðu heiti og eina setningu um hvað hvert verk sannar.", "Bættu við mynd, skjámynd eða virkum hlekk þar sem það á við."], deliverable: "Þriggja verka vinnumappalisti með stuttri skýringu og sönnun fyrir hvert verk." },
      { key: "hard", label: "Erfitt", kicker: "Sækja um", points: 2, task: "Tengdu gögnin við raunhæft tækifæri.", steps: ["Skrifaðu stutt umsóknarskilaboð fyrir tilbúið nema- eða sumarstarf.", "Fáðu jafningja til að lesa ferilskrána sem atvinnurekandi.", "Skráðu og framkvæmdu 2 breytingar eftir yfirferðina."], deliverable: "Umsóknarskilaboð, loka-PDF og tvær línur um breytingarnar sem þú gerðir." },
    ],
  },
];

const levelGlyph = { easy: "01", medium: "02", hard: "03" } as const;

export default function Home() {
  const [selected, setSelected] = useState(7);
  const [openLevel, setOpenLevel] = useState<string>("easy");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [embedded, setEmbedded] = useState(false);
  const [locked, setLocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = Number(params.get("verk"));
    const isEmbedded = window.self !== window.top;
    setEmbedded(isEmbedded);
    setLocked(isEmbedded || params.get("locked") === "1");
    if (projects.some((project) => project.number === fromUrl)) setSelected(fromUrl);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || locked) return;
    const url = new URL(window.location.href);
    url.searchParams.set("verk", String(selected));
    window.history.replaceState({}, "", url);
    setOpenLevel("easy");
  }, [hydrated, locked, selected]);

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

  const project = useMemo(() => projects.find((item) => item.number === selected) ?? projects[0], [selected]);
  const activeLevel = project.levels.find((level) => level.key === openLevel) ?? project.levels[0];
  const activeLevelNumber = project.levels.findIndex((level) => level.key === activeLevel.key) + 1;
  const doneCount = activeLevel.steps.filter((_, index) => checked[`${project.number}-${activeLevel.key}-${index}`]).length;
  const totalCount = activeLevel.steps.length;

  const selectProject = (number: number) => {
    setSelected(number);
    document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={`site-shell${embedded ? " embedded" : ""}${locked ? " locked" : ""}`}>
      <canvas ref={canvasRef} className="ambient" aria-hidden="true" />
      {!hydrated ? <div className="loading-project" role="status">Hleð verkefni…</div> : <>
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
                <button className="level-trigger" onClick={() => setOpenLevel(level.key)} aria-expanded={expanded}>
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
        <span>LÆRÐU · PRÓFAÐU · LAGAÐU · SKILAÐU</span>
      </footer>}
      </>}
    </main>
  );
}
