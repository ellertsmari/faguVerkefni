import { useEffect, useMemo, useState } from "react";

import { defaultProjects } from "./project-data";
import {
  CONTRIBUTION_LABELS,
  SCORES,
  TEAMWORK_LABELS,
  encodeEvaluation,
  validateEvaluation,
} from "./peer-grade.mjs";

type Entry = { name: string; contribution: number | null; teamwork: number | null; reason: string; self: boolean };

const emptyEntry = (self = false): Entry => ({ name: "", contribution: null, teamwork: null, reason: "", self });
const labels = { contribution: CONTRIBUTION_LABELS, teamwork: TEAMWORK_LABELS } as Record<string, Record<string, string>>;
const axisTitle = { contribution: "Framlag", teamwork: "Samvinna" } as const;

function projectFromUrl() {
  const verk = Number(new URLSearchParams(window.location.search).get("verk"));
  return defaultProjects.find((project) => project.number === verk && project.peerEval) ?? defaultProjects.find((project) => project.peerEval)!;
}

export default function PeerEval() {
  const [project] = useState(projectFromUrl);
  const storageKey = `fagu-jafningjamat-${project.number}`;
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as Entry[] | null;
      if (Array.isArray(saved) && saved.length >= 2) return saved;
    } catch {
      // Storage may be blocked. A fresh form still works.
    }
    return [emptyEntry(true), emptyEntry(), emptyEntry()];
  });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {
      // Draft persistence is a convenience only.
    }
  }, [entries, storageKey]);

  const balance = useMemo(() => ({
    contribution: entries.reduce((sum, entry) => sum + (entry.contribution ?? 0), 0),
    teamwork: entries.reduce((sum, entry) => sum + (entry.teamwork ?? 0), 0),
  }), [entries]);
  const error = useMemo(() => validateEvaluation(entries), [entries]);

  function update(index: number, patch: Partial<Entry>) {
    setEntries((current) => current.map((entry, i) => i === index ? { ...entry, ...patch } : entry));
    setOutput("");
    setCopied(false);
  }

  function generate() {
    if (error) return;
    setOutput(encodeEvaluation({ project: project.number, entries }));
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="site-shell eval-shell">
      <header className="topbar">
        <div className="brand"><span>FAGU</span><i /> JAFNINGJAMAT · VERK {String(project.number).padStart(2, "0")}</div>
        <div className="status">{entries.length} Í HÓPNUM</div>
      </header>

      <article className="project eval">
        <div className="project-heading">
          <div className="project-index">MAT</div>
          <div>
            <p className="eyebrow">{project.title}</p>
            <h2>Hvernig gekk hópvinnan?</h2>
            <p>Metið ykkur sjálf og alla í hópnum eftir kynninguna. Svörin sér aðeins kennari. Þau eru ráðgefandi: kennari staðfestir tölurnar og notar þær til að stilla einkunn hvers og eins út frá hópeinkunninni.</p>
          </div>
        </div>

        <aside className="scenario">
          <h3>Svona virkar það</h3>
          <p>Hvert stig segir hvernig viðkomandi stóð sig <b>miðað við hina í hópnum</b>. Þess vegna mega stigin í hvorum dálki ekki leggjast saman í meira en núll: ef einhver fær plús þarf einhver annar mínus. Hópur þar sem allir lögðu jafnt af mörkum fær bara núll. Rökstuðningur er skylda við hverja línu, ein til tvær setningar duga.</p>
        </aside>

        <div className={`balance-strip${balance.contribution > 0 || balance.teamwork > 0 ? " over" : ""}`} aria-live="polite">
          <span><b>Framlag samtals: {balance.contribution > 0 ? `+${balance.contribution}` : balance.contribution}</b> {balance.contribution > 0 ? "· of hátt, taktu stig til baka" : "· í lagi"}</span>
          <span><b>Samvinna samtals: {balance.teamwork > 0 ? `+${balance.teamwork}` : balance.teamwork}</b> {balance.teamwork > 0 ? "· of hátt, taktu stig til baka" : "· í lagi"}</span>
        </div>

        <form className="eval-form" onSubmit={(event) => { event.preventDefault(); generate(); }}>
          {entries.map((entry, index) => (
            <fieldset key={index} className={`eval-member${entry.self ? " self" : ""}`}>
              <legend>{entry.self ? "Þú sjálf/ur" : `Félagi ${index}`}</legend>
              <div className="eval-name-row">
                <label>Nafn<input value={entry.name} onChange={(event) => update(index, { name: event.target.value })} required maxLength={80} autoComplete="off" placeholder={entry.self ? "Fullt nafn þitt" : "Fullt nafn"} /></label>
                {!entry.self && entries.length > 2 && <button type="button" className="eval-remove" onClick={() => { setEntries((current) => current.filter((_, i) => i !== index)); setOutput(""); }}>Fjarlægja</button>}
              </div>
              {(["contribution", "teamwork"] as const).map((axis) => (
                <div className="eval-axis" key={axis} role="radiogroup" aria-label={`${axisTitle[axis]}: ${entry.name || (entry.self ? "þú" : `félagi ${index}`)}`}>
                  <small>{axisTitle[axis]}</small>
                  <div className="eval-scores">
                    {SCORES.map((score) => (
                      <label key={score} className={entry[axis] === score ? "picked" : ""}>
                        <input type="radio" name={`${axis}-${index}`} value={score} checked={entry[axis] === score} onChange={() => update(index, { [axis]: score })} />
                        <b>{score > 0 ? `+${score}` : score}</b>
                        <span>{labels[axis][String(score)]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <label>Rökstuðningur<textarea value={entry.reason} onChange={(event) => update(index, { reason: event.target.value })} required rows={2} maxLength={1000} placeholder="Hvað gerði viðkomandi? Ein til tvær setningar." /></label>
            </fieldset>
          ))}

          <div className="eval-actions">
            <button type="button" className="teacher-button" onClick={() => { setEntries((current) => [...current, emptyEntry()]); setOutput(""); }}>+ Bæta við félaga</button>
            <button type="submit" className="teacher-button primary" disabled={Boolean(error)}>Búa til texta fyrir Canvas</button>
          </div>
          {error && <p className="eval-error" role="status">{error}</p>}
        </form>

        {output && <section className="eval-output" aria-labelledby="eval-output-title">
          <h3 id="eval-output-title">Afritaðu þetta og límdu í Canvas</h3>
          <p>Opnaðu verkefnið „Jafningjamat Verk {project.number}“ í Canvas, veldu <b>Texti</b> sem skilamáta, límdu allan textann þar og skilaðu. Neðsta línan, KÓÐI, þarf að fylgja með óbreytt.</p>
          <textarea readOnly value={output} rows={Math.min(24, output.split("\n").length + 1)} onFocus={(event) => event.currentTarget.select()} />
          <div className="eval-actions">
            <button type="button" className="teacher-button primary" onClick={() => void copy()}>{copied ? "Afritað ✓" : "Afrita textann"}</button>
            <a className="teacher-button" href={`https://canvas.tskoli.is/courses/1907/assignments/${project.canvasId}`} target="_blank" rel="noreferrer">Opna Verk {project.number} í Canvas ↗</a>
          </div>
        </section>}
      </article>
    </main>
  );
}
