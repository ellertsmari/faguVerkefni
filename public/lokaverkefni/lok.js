// Draws the lokaverkefni overview (window.DAGUR = 0) or one day page (2–5) from data.js.
// Group size, role and tick marks live in this browser only. Nothing is sent anywhere.
(function () {
  const L = window.LOK, N = window.DAGUR || 0;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lok-" + k); return v === null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("lok-" + k, v); } catch { /* private window */ } },
  };
  const params = new URLSearchParams(location.search);
  let size = store.get("size", "4") === "3" ? 3 : 4;
  let role = store.get("role", "");
  if (size === 3 && role === "tilbod") role = "oryggi";
  if (L.roles[params.get("hlutverk")]) role = params.get("hlutverk");
  if (params.get("hopur") === "3" || params.get("hopur") === "4") size = Number(params.get("hopur"));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const roleName = (k) => L.roles[k].name;
  const today = new Date().toISOString().slice(0, 10);

  function nav() {
    const n = el("nav", "days");
    n.setAttribute("aria-label", "Dagar lokaverkefnisins");
    const a0 = el("a", N === 0 ? "on" : "", "<b>Yfirlit</b><span>Allt verkefnið</span>"); a0.href = "./"; n.append(a0);
    L.days.forEach((d) => {
      const a = el("a", (N === d.n ? "on " : "") + (d.date === today ? "today" : ""), `<b>Dagur ${d.n}</b><span>${d.label}</span>`);
      a.href = `dagur${d.n}.html`; if (N === d.n) a.setAttribute("aria-current", "page"); n.append(a);
    });
    return n;
  }

  function picker(onChange) {
    const box = el("section", "picker");
    box.append(el("h2", "", "Hópurinn minn"));
    const row1 = el("div", "pick-row"); row1.append(el("span", "pick-label", "Við erum"));
    [4, 3].forEach((s) => {
      const b = el("button", size === s ? "on" : "", s === 4 ? "4 í hóp" : "3 í hóp"); b.type = "button";
      b.setAttribute("aria-pressed", String(size === s));
      b.onclick = () => { size = s; store.set("size", String(s)); if (s === 3 && role === "tilbod") { role = "oryggi"; store.set("role", role); } onChange(); };
      row1.append(b);
    });
    const row2 = el("div", "pick-row"); row2.append(el("span", "pick-label", "Ég er"));
    Object.keys(L.roles).filter((k) => size === 4 || k !== "tilbod").forEach((k) => {
      const b = el("button", role === k ? "on" : "", `${L.roles[k].icon} ${roleName(k)}`); b.type = "button";
      b.setAttribute("aria-pressed", String(role === k));
      b.onclick = () => { role = k; store.set("role", k); onChange(); };
      row2.append(b);
    });
    box.append(row1, row2);
    if (size === 3) box.append(el("p", "note", `Í þriggja manna hópi skiptist fjórða hlutverkið, <strong>Tilboð og samskipti</strong>, jafnt á milli ykkar. <strong>Teiknari:</strong> ${L.share3.teikn}. <strong>Reiknari:</strong> ${L.share3.reikn}. <strong>Öryggi og heimildir:</strong> ${L.share3.oryggi}.`));
    return box;
  }

  function brief(open) {
    const d = el("details", "brief"); if (open) d.open = true;
    d.append(el("summary", "", "🏠 Verkbeiðnin og grunnmyndin"));
    d.append(el("div", "brief-body", `
      <p><strong>Viðskiptavinur:</strong> eigandi íbúðar 7, sem er 65 m². Hann vill endurnýja <strong>alrýmið</strong> og <strong>vinnuherbergið</strong>.</p>
      <p><strong>Markmið:</strong> betri lýsing, meira rafmagnsöryggi, meiri geymsla og betri vinnuaðstaða, með sem minnstri röskun.</p>
      <p><strong>Hámark:</strong> ${L.budget} með efni, vinnu og VSK. Tímagjald í þessu verkefni: ${L.rate} á klukkustund án VSK.</p>
      <p class="small">Viðskiptavinurinn er tilbúinn. Ekki bæta við raunverulegum upplýsingum um fólk.</p>
      <img src="ibud7.svg" alt="Grunnmynd íbúðar 7. Íbúðin er 10 × 6,5 m. Alrými hægra megin, 4,0 × 6,5 m. Vinnuherbergi neðst til vinstri, 6,0 × 2,8 m. Svefnherbergi efst til vinstri, 6,0 × 3,7 m, ekki hluti af verkinu.">`));
    return d;
  }

  function video(file, title) {
    const s = el("section", "video");
    s.append(el("h2", "", "🎬 Horfðu fyrst á myndbandið"));
    const v = el("video"); v.controls = true; v.preload = "metadata"; v.src = `video/${file}.mp4`; v.poster = `video/${file}.jpg`;
    v.setAttribute("aria-label", title); s.append(v);
    return s;
  }

  function journal() {
    const s = el("section", "journal");
    s.append(el("h2", "", "📓 Dagbókin: þrjár setningar í lok dags"));
    s.append(el("p", "", "Hver og einn skrifar sína færslu í <code>Dagbok_Hopur[númer]</code>. Kennarar lesa dagbókina þegar þeir meta framlag þitt."));
    const q = el("blockquote", "", L.journal.replace(/^(\[.*?\]:)/, "<strong>$1</strong>"));
    const b = el("button", "copy", "Afrita"); b.type = "button";
    b.onclick = () => navigator.clipboard.writeText(L.journal).then(() => { b.textContent = "Afritað ✓"; setTimeout(() => (b.textContent = "Afrita"), 1500); });
    s.append(q, b, el("p", "small", "Notaðirðu ekki AI í dag? Skrifaðu það. Misstirðu af degi? Skrifaðu hvað þú gerðir til að ná hópnum."));
    return s;
  }

  function links() {
    const s = el("section", "links");
    s.append(el("h2", "", "Skjöl og skil"));
    s.append(el("p", "btns", `<a href="${L.files.kostnadur}" target="_blank" rel="noopener">📊 Kostnaðaráætlun (Excel)</a><a href="${L.files.tilbod}" target="_blank" rel="noopener">📄 Tilboðssniðmát (Excel)</a><a class="main" href="${L.canvas}" target="_blank" rel="noopener">Verkefnið í Canvas: matskvarði og skil</a>`));
    return s;
  }

  // ---- one day
  function stepList(day, si, steps, tag) {
    const ol = el("ol", "steps");
    steps.forEach(({ step, i, extra }) => {
      const id = `d${day.n}-${si}-${i}`, li = el("li");
      const cb = el("input"); cb.type = "checkbox"; cb.id = id; cb.checked = store.get(id, "") === "1";
      cb.onchange = () => { store.set(id, cb.checked ? "1" : ""); li.classList.toggle("done", cb.checked); count(); };
      li.classList.toggle("done", cb.checked);
      const lab = el("label", "", (extra && tag ? `<span class="tag">${tag}</span> ` : "") + step.t); lab.htmlFor = id;
      li.append(cb, lab);
      if (step.prompt) {
        const p = el("div", "prompt"); p.append(el("p", "prompt-label", "Afritaðu í Copilot:"), el("blockquote", "", step.prompt));
        const b = el("button", "copy", "Afrita"); b.type = "button";
        b.onclick = () => navigator.clipboard.writeText(step.prompt).then(() => { b.textContent = "Afritað ✓"; setTimeout(() => (b.textContent = "Afrita"), 1500); });
        p.append(b); li.append(p);
      }
      if (step.hint) { const h = el("details", "hint"); h.append(el("summary", "", "Hjálp"), el("p", "", step.hint)); li.append(h); }
      ol.append(li);
    });
    return ol;
  }
  let count = () => {};

  // A day is a short guided sequence: video, group, the day's work, journal, and everything else last.
  // One stage is on screen at a time, and the stepper lets you jump to any of them.
  function dayPage(root, day, startAt) {
    const idx = L.days.indexOf(day);
    // In a group of three the tilboð steps move to the role named in `in3`.
    const secs = day.sections.map((sec, si) => ({ sec, si, steps: sec.steps.map((step, i) => ({ step, i, si })) }));
    if (size === 3) {
      const t = secs.find((s) => s.sec.who === "tilbod");
      if (t) t.steps.forEach((x) => secs.find((s) => s.sec.who === (x.step.in3 || "oryggi")).steps.push({ ...x, extra: true }));
    }
    const shown = secs.filter((s) => !(size === 3 && s.sec.who === "tilbod"));
    const isRole = (s) => Boolean(L.roles[s.sec.who]);
    const mine = shown.find((s) => isRole(s) && s.sec.who === role);
    const others = shown.filter((s) => isRole(s) && s.sec.who !== role);
    const lok = shown.find((s) => s.sec.who === "lok");
    const ids = (s) => (s ? s.steps.map((x) => `d${day.n}-${x.si}-${x.i}`) : []);
    const ticked = (list) => list.filter((id) => store.get(id, "") === "1").length;
    const list = (s) => { const ol = el("ol", "steps"); s.steps.forEach((x) => ol.append(stepList(day, x.si, [x], "Úr tilboðshlutverkinu").firstChild)); return ol; };

    const stages = [{ key: "video", label: "Myndband", title: "Horfðu á myndband dagsins", ids: [] }, { key: "hopur", label: "Hópurinn", title: "Hópurinn þinn og hlutverkið þitt", ids: [] }];
    let roleStage = false;
    shown.forEach((s) => {
      if (s.sec.who === "lok") return;
      if (!isRole(s)) stages.push({ key: "saman", label: "Saman", title: s.sec.title, time: s.sec.time, sec: s, ids: ids(s) });
      else if (!roleStage) { roleStage = true; stages.push({ key: "mitt", label: "Þitt hlutverk", title: mine ? `${L.roles[role].icon} ${roleName(role)}` : "Þitt hlutverk", time: mine?.sec.time, ids: ids(mine) }); }
    });
    stages.push({ key: "dagbok", label: "Dagbók", title: lok ? lok.sec.title : "Áður en þið farið", time: lok?.sec.time, ids: ids(lok) });
    stages.push({ key: "meira", label: "Meira", title: "Allt hitt", ids: [] });

    const stageKey = `d${day.n}-stage`;
    // ?skref=3 opens a given stage (for the teacher's projector); ?hlutverk= and ?hopur= preset the group.
    let at = Math.min(Math.max(startAt ?? ((parseInt(params.get("skref") ?? "", 10) - 1) || parseInt(store.get(stageKey, "0"), 10) || 0), 0), stages.length - 1);
    const isDone = (st, i) => (st.ids.length ? ticked(st.ids) === st.ids.length : st.key === "hopur" ? Boolean(role) : st.key === "video" ? at > i : false);
    const go = (i, focus = true) => { at = i; store.set(stageKey, String(i)); draw(); if (focus) { window.scrollTo(0, 0); root.querySelector(".stage h2")?.focus(); } };

    function briefDialog() {
      let dlg = document.getElementById("brief-dialog");
      if (!dlg) {
        dlg = el("dialog"); dlg.id = "brief-dialog";
        const x = el("button", "close", "Loka ✕"); x.type = "button"; x.onclick = () => dlg.close();
        const b = brief(true); b.querySelector("summary").remove();
        dlg.append(el("h2", "", "🏠 Verkbeiðnin og grunnmyndin"), b.querySelector(".brief-body"), x);
        dlg.onclick = (e) => { if (e.target === dlg) dlg.close(); };
        document.body.append(dlg);
      }
      dlg.showModal();
    }

    function body(st) {
      const f = document.createDocumentFragment();
      if (st.key === "video") {
        f.append(el("p", "lead", day.goal));
        const v = video(`dagur${day.n}`, `Myndband: dagur ${day.n}`); v.querySelector("h2").remove(); f.append(v);
      } else if (st.key === "hopur") {
        f.append(el("p", "lead", "Veldu hvað þið eruð mörg og hvaða hlutverk þú ert með. Þá sérðu bara þín verk."));
        // role and size decide which steps exist, so a choice rebuilds the whole day
        const pk = picker(() => dayPage(root, day, at)); pk.querySelector("h2").remove(); pk.className = "picker bare"; f.append(pk);
        f.append(el("p", "small", "Ertu ekki komin(n) með hlutverk? Ákveðið það saman núna. Valið er bara vistað í þessum vafra."));
      } else if (st.key === "saman") {
        f.append(el("p", "lead", "Þetta gerið þið öll saman."));
        if (day.message) {
          const open = Date.now() >= Date.parse(day.message.opens) || params.get("syna") === "1";
          f.append(el("div", "message" + (open ? "" : " locked"), open
            ? `<h3>🚨 Ný skilaboð frá viðskiptavini</h3><blockquote>${day.message.text}</blockquote>`
            : `<h3>🔒 Ný skilaboð frá viðskiptavini</h3><p>${day.message.locked}</p>`));
        }
        f.append(list(st.sec));
      } else if (st.key === "mitt") {
        if (!mine) {
          f.append(el("p", "lead", "Veldu fyrst hlutverkið þitt. Þá birtast verkin þín hér."));
          const b = el("button", "next", "Velja hlutverk"); b.type = "button"; b.onclick = () => go(1); f.append(b);
        } else {
          f.append(el("p", "lead", "Þetta eru þín verk í dag. Hjálpaðu hinum þegar þú ert búin(n)."), list(mine));
        }
      } else if (st.key === "dagbok") {
        if (lok) f.append(list(lok));
        const j = journal(); j.className = "journal bare"; f.append(j);
        const d = el("div", "done-box"); d.append(el("h3", "", "✅ Í lok dags er hópurinn búinn með"));
        const ul = el("ul"); day.done.forEach((x) => ul.append(el("li", "", x))); d.append(ul); f.append(d);
      } else {
        f.append(el("p", "lead", "Hér er allt sem þú gætir þurft að fletta upp."));
        f.append(brief(false));
        if (others.length) {
          const d = el("details", "brief"); d.append(el("summary", "", "👥 Hvað gera hinir í hópnum í dag?"));
          others.forEach((o) => { const w = el("div", "other"); w.append(el("h3", "", `${L.roles[o.sec.who].icon} ${roleName(o.sec.who)}`), list(o)); d.append(w); });
          f.append(d);
        }
        const h = el("details", "brief"); h.append(el("summary", "", "🙋 Föst eða fastur?"), el("div", "brief-body", "<p>1. Lestu <strong>Hjálp</strong> undir skrefinu. 2. Spurðu hópinn. 3. Réttu upp hönd.</p><p>Vantar einhvern í hópinn í dag? Hópurinn heldur áfram. Skiptið verkum þess sem vantar á milli ykkar.</p>"));
        f.append(h, el("h3", "", "Aðrir dagar"), nav());
      }
      return f;
    }

    function draw() {
      root.innerHTML = "";
      const top = el("header", "top");
      top.append(el("p", "kicker", `<a href="./">← Yfirlit</a> · DAGUR ${day.n} AF 5 · ${day.label.toUpperCase()}`), el("h1", "", day.title));
      const stepper = el("ol", "stepper"); stepper.setAttribute("aria-label", "Skref dagsins");
      stages.forEach((st, i) => {
        const done = i !== at && isDone(st, i);
        const b = el("button", (i === at ? "on " : "") + (done ? "done" : ""), `<i>${done ? "✓" : i + 1}</i><span>${st.label}</span>`); b.type = "button";
        if (i === at) b.setAttribute("aria-current", "step");
        b.onclick = () => go(i);
        const li = el("li"); li.append(b); stepper.append(li);
      });
      const st = stages[at], card = el("section", "stage");
      const h = el("h2", "", st.title); h.tabIndex = -1;
      card.append(el("p", "count", `Skref ${at + 1} af ${stages.length}`), h, body(st));
      const foot = el("div", "stage-nav");
      if (at > 0) { const b = el("button", "back", "← Til baka"); b.type = "button"; b.onclick = () => go(at - 1); foot.append(b); } else foot.append(el("span"));
      if (at < stages.length - 1) {
        const b = el("button", "next", `Áfram: ${stages[at + 1].label} →`); b.type = "button";
        if (st.key === "hopur" && !role) { b.disabled = true; b.textContent = "Veldu hlutverk fyrst"; }
        b.onclick = () => go(at + 1); foot.append(b);
      } else {
        const next = L.days[idx + 1];
        foot.append(el("span", "", next ? `<a class="next" href="dagur${next.n}.html">Dagur ${next.n} →</a>` : `<a class="next" href="${L.kynning}" target="_blank" rel="noopener">Kynningin 8. des. →</a>`));
      }
      card.append(foot);
      const quick = el("footer", "quick");
      const bb = el("button", "", "🏠 Verkbeiðni og grunnmynd"); bb.type = "button"; bb.onclick = briefDialog;
      quick.append(bb, el("span", "", `<a href="${L.files.kostnadur}" target="_blank" rel="noopener">📊 Kostnaðaráætlun</a><a href="${L.files.tilbod}" target="_blank" rel="noopener">📄 Tilboðssniðmát</a><a href="${L.canvas}" target="_blank" rel="noopener">Canvas: matskvarði og skil</a>`));
      root.append(top, stepper, card, quick);
      count = () => {
        const n = ticked(st.ids), c = card.querySelector(".count");
        c.textContent = `Skref ${at + 1} af ${stages.length}` + (st.time ? ` · ${st.time}` : "") + (st.ids.length ? ` · ${n} af ${st.ids.length} búin` : "");
        c.classList.toggle("all", st.ids.length > 0 && n === st.ids.length);
      };
      count();
    }
    document.querySelector(".progress")?.remove();
    draw();
  }

  // ---- overview
  function overview(root) {
    root.innerHTML = "";
    const hero = el("header", "hero");
    hero.append(el("p", "kicker", "LOKAVERKEFNI · HÓPVERKEFNI · FIMM DAGAR"), el("h1", "", "Heildarlausn fyrir íbúð 7"),
      el("p", "goal", "Hópurinn ykkar er lítið fyrirtæki. Viðskiptavinur vill láta endurnýja íbúðina sína. Þið ákveðið lausn, teiknið hana, reiknið verðið og skilið tilboði."));
    root.append(nav(), hero, video("yfirlit", "Myndband: yfirlit yfir lokaverkefnið"), brief(true));

    const days = el("section", "daylist"); days.append(el("h2", "", "🗓️ Einn dagur í einu"));
    days.append(el("p", "", "Opnaðu síðu dagsins í byrjun hvers tíma. Þar er myndband dagsins og gátlisti fyrir þitt hlutverk."));
    const grid = el("div", "daygrid");
    grid.append(el("div", "daycard past", "<b>Dagur 1</b><span>mán. 23. nóv.</span><strong>Verkbeiðni og verkáætlun</strong><em>Búið: Lokaverkefni A</em>"));
    L.days.forEach((d) => { const a = el("a", "daycard" + (d.date === today ? " today" : ""), `<b>Dagur ${d.n}</b><span>${d.label}</span><strong>${d.short}</strong><em>${d.date === today ? "Í dag: opna síðuna →" : "Opna síðuna →"}</em>`); a.href = `dagur${d.n}.html`; grid.append(a); });
    const k = el("a", "daycard", "<b>Kynning</b><span>þri. 8. des.</span><strong>10 mínútur á hóp</strong><em>Lokaverkefni C í Canvas →</em>"); k.href = L.kynning; k.target = "_blank"; k.rel = "noopener"; grid.append(k);
    days.append(grid); root.append(days);

    root.append(picker(() => overview(root)));
    const roles = el("section", "roles"); roles.append(el("h2", "", "👥 Hlutverkin"));
    roles.append(el("p", "", "Hver og einn ber ábyrgð á einu hlutverki. Allir hjálpa til, en sá eða sú sem ber ábyrgðina sér um að verkið klárist."));
    const t = el("table"); t.innerHTML = "<thead><tr><th>Hlutverk</th><th>Ber ábyrgð á</th></tr></thead>";
    const tb = el("tbody");
    Object.keys(L.roles).filter((r) => size === 4 || r !== "tilbod").forEach((r) => {
      const does = size === 3 ? `${L.roles[r].does}. Úr tilboðshlutverkinu: ${L.share3[r]}` : L.roles[r].does;
      tb.append(el("tr", r === role ? "mine" : "", `<td>${L.roles[r].icon} <strong>${roleName(r)}</strong></td><td>${does}</td>`));
    });
    t.append(tb); roles.append(t); root.append(roles);

    const f = el("section", "folder"); f.append(el("h2", "", "📁 Svona lítur mappan út í lokin"));
    f.append(el("p", "", "Mappan heitir <code>Ibud7_Hopur[númer]</code>. Þið skilið henni sem ZIP-skrá, ásamt tilboðinu sem PDF."));
    const fl = el("ul", "tree"); L.folder.forEach(([n, d]) => fl.append(el("li", "", `<code>${n}</code> <span>${d}</span>`))); f.append(fl); root.append(f);
    root.append(journal(), links());
    document.querySelector(".progress")?.remove();
  }

  function theme() {
    const b = el("button", "theme", "☀︎"); b.type = "button"; b.title = "Ljóst eða dökkt"; b.setAttribute("aria-label", "Skipta á milli ljóss og dökks útlits");
    b.onclick = () => { const t = document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = t; try { localStorage.setItem("fagu-theme", t); } catch { /* ignore */ } };
    document.body.append(b);
  }

  const root = document.getElementById("root");
  const day = L.days.find((d) => d.n === N);
  if (day) dayPage(root, day); else overview(root);
  theme();
})();
