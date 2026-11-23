// Draws the lokaverkefni overview (window.DAGUR = 0) or one day page (2–5) from data.js.
// Group size, role and tick marks live in this browser only. Nothing is sent anywhere.
(function () {
  const L = window.LOK, N = window.DAGUR || 0;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lok-" + k); return v === null ? d : v; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("lok-" + k, v); } catch { /* private window */ } },
  };
  let size = store.get("size", "4") === "3" ? 3 : 4;
  let role = store.get("role", "");
  if (size === 3 && role === "tilbod") role = "oryggi";
  const params = new URLSearchParams(location.search);
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

  function dayPage(root, day) {
    root.innerHTML = "";
    const idx = L.days.indexOf(day);
    const hero = el("header", "hero");
    hero.append(el("p", "kicker", `LOKAVERKEFNI · DAGUR ${day.n} AF 5 · ${day.label.toUpperCase()}`), el("h1", "", day.title), el("p", "goal", day.goal));
    root.append(nav(), hero, video(`dagur${day.n}`, `Myndband: dagur ${day.n}`));

    if (day.message) {
      const open = Date.now() >= Date.parse(day.message.opens) || params.get("syna") === "1";
      root.append(el("section", "message" + (open ? "" : " locked"), open
        ? `<h2>🚨 Ný skilaboð frá viðskiptavini</h2><blockquote>${day.message.text}</blockquote>`
        : `<h2>🔒 Ný skilaboð frá viðskiptavini</h2><p>${day.message.locked}</p>`));
    }
    root.append(brief(day.n === 2), picker(() => dayPage(root, day)));

    const done = el("section", "done-box");
    done.append(el("h2", "", "✅ Í lok dags er hópurinn búinn með"));
    const ul = el("ul"); day.done.forEach((d) => ul.append(el("li", "", d))); done.append(ul);
    root.append(done);

    // In a group of three the tilboð steps move to the role named in `in3`.
    const secs = day.sections.map((sec, si) => ({ sec, si, steps: sec.steps.map((step, i) => ({ step, i })) }));
    if (size === 3) {
      const t = secs.find((s) => s.sec.who === "tilbod");
      if (t) t.steps.forEach((x) => { const to = secs.find((s) => s.sec.who === (x.step.in3 || "oryggi")); to.steps.push({ ...x, si: t.si, extra: true }); });
    }
    const shown = secs.filter((s) => !(size === 3 && s.sec.who === "tilbod"));
    const isRole = (s) => L.roles[s.sec.who];
    const mine = shown.filter((s) => isRole(s) && s.sec.who === role);
    const others = shown.filter((s) => isRole(s) && s.sec.who !== role);

    const block = (s, cls) => {
      const b = el("section", "sec " + cls), who = s.sec.who;
      const title = L.roles[who] ? `${L.roles[who].icon} ${roleName(who)}` : s.sec.title;
      b.append(el("h2", "", `${title} <span class="time">${s.sec.time}</span>`));
      // steps that came from the tilboð section keep their own ids
      const byOrigin = s.steps.map((x) => ({ ...x, si: x.si ?? s.si }));
      const ol = el("ol", "steps");
      byOrigin.forEach((x) => { const one = stepList(day, x.si, [x], "Úr tilboðshlutverkinu"); ol.append(one.firstChild); });
      b.append(ol);
      return b;
    };
    let roleDone = false;
    shown.forEach((s) => {
      if (!isRole(s)) { root.append(block(s, "together")); return; }
      if (roleDone) return;
      roleDone = true;
      if (!role) {
        root.append(el("p", "choose", "👆 Veldu hlutverkið þitt efst á síðunni. Þá sérðu þín verk fyrst."));
        others.forEach((o) => root.append(block(o, "role")));
      } else {
        mine.forEach((m) => { const b = block(m, "role mine"); b.prepend(el("p", "kicker", "ÞITT HLUTVERK Í DAG")); root.append(b); });
        const d = el("details", "others"); d.append(el("summary", "", "Hvað gera hinir í hópnum í dag?"));
        others.forEach((o) => d.append(block(o, "role"))); root.append(d);
      }
    });

    root.append(journal());
    root.append(el("section", "stuck", "<h2>Föst eða fastur?</h2><p>1. Lestu <strong>Hjálp</strong> undir skrefinu. 2. Spurðu hópinn. 3. Réttu upp hönd.</p><p>Vantar einhvern í hópinn í dag? Hópurinn heldur áfram. Skiptið verkum þess sem vantar á milli ykkar.</p>"));
    root.append(links());
    const foot = el("nav", "prevnext");
    const prev = L.days[idx - 1], next = L.days[idx + 1];
    foot.innerHTML = (prev ? `<a href="dagur${prev.n}.html">← Dagur ${prev.n}</a>` : `<a href="./">← Yfirlit</a>`) + (next ? `<a href="dagur${next.n}.html">Dagur ${next.n} →</a>` : `<a href="${L.kynning}" target="_blank" rel="noopener">Kynningin 8. des. →</a>`);
    root.append(foot);

    const bar = el("div", "progress"); bar.setAttribute("role", "status"); document.querySelector(".progress")?.remove(); document.body.append(bar);
    count = () => {
      const all = root.querySelectorAll(".sec.together input, .sec.mine input"), n = [...all].filter((c) => c.checked).length;
      bar.textContent = role ? `Dagur ${day.n}: ${n} af ${all.length} skrefum hjá þér` : `Dagur ${day.n}: veldu hlutverk til að sjá þín skref`;
      bar.classList.toggle("all", all.length > 0 && n === all.length);
    };
    count();
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
