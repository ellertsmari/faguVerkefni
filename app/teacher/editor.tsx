"use client";

import { useEffect, useState } from "react";
import type { EditorRecord } from "../../db/projects";
import type { Level, Project } from "../project-data";
import ProjectBoard from "../project-board";

export default function Editor() {
  const [records, setRecords] = useState<EditorRecord[]>([]);
  const [selected, setSelected] = useState(6);
  const [project, setProject] = useState<Project | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const record = records.find((item) => item.project.number === selected);
  const dirty = project !== null && JSON.stringify(project) !== savedJson;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/teacher/projects", { cache: "no-store", signal: controller.signal });
        const data = await response.json() as { records: EditorRecord[]; error?: string };
        if (!response.ok) throw new Error(data.error);
        const items = data.records;
        const first = items.find((item) => item.project.number === 6) ?? items[0];
        setRecords(items);
        setSelected(first.project.number);
        setProject(first.project);
        setSavedJson(JSON.stringify(first.project));
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Ekki tókst að sækja verkefnin.");
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function select(number: number) {
    if (number === selected || busy) return;
    if (dirty && !window.confirm("Óvistaðar breytingar glatast. Skipta um verkefni?")) return;
    const next = records.find((item) => item.project.number === number)!;
    setSelected(number);
    setProject(next.project);
    setSavedJson(JSON.stringify(next.project));
    setMessage("");
    setError("");
  }

  function change(field: "title" | "intro" | "tools" | "ai" | "scenario" | "submission", value: string) {
    setProject((current) => current ? { ...current, [field]: value } : current);
    setMessage("");
  }

  function changeLevel(index: number, field: keyof Level, value: string | string[]) {
    setProject((current) => current ? {
      ...current,
      levels: current.levels.map((level, i) => i === index ? { ...level, [field]: value } : level),
    } : current);
    setMessage("");
  }

  async function save(action: "draft" | "publish") {
    if (!project || !record || busy) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/teacher/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, revision: record.revision, action }),
      });
      const data = await response.json() as EditorRecord & { error?: string };
      if (!response.ok) throw new Error(data.error);
      const updated: EditorRecord = {
        project: data.project,
        revision: data.revision,
        hasDraft: data.hasDraft,
        publishedAt: action === "publish" ? data.publishedAt : record.publishedAt,
      };
      setRecords((items) => items.map((item) => item.project.number === selected ? updated : item));
      setProject(updated.project);
      setSavedJson(JSON.stringify(updated.project));
      setMessage(action === "publish"
        ? "Birt fyrir nemendur. Nýjar opnanir sýna breytingarnar strax; opnar síður uppfærast innan um 30 sekúndna."
        : "Drög vistuð á netinu. Nemendur sjá áfram síðustu birtu útgáfu.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ekki tókst að vista. Reyndu aftur.");
    } finally {
      setBusy(false);
    }
  }

  if (!project || !record) return (
    <div className="teacher-notice" role="status">
      {error || "Sæki verkefni…"}
      {error && <button className="teacher-button" onClick={() => window.location.reload()} disabled={busy}>Reyna aftur</button>}
    </div>
  );

  return (
    <div className="teacher-workspace">
      <aside className="teacher-projects" aria-label="Veldu verkefni">
        {records.map((item) => (
          <button key={item.project.number} onClick={() => select(item.project.number)} disabled={busy}
            aria-current={selected === item.project.number ? "page" : undefined}>
            <span>VERK {String(item.project.number).padStart(2, "0")}</span>
            <strong>{item.project.title}</strong>
            {item.hasDraft && <small>Vistuð drög</small>}
          </button>
        ))}
      </aside>
      <div className="teacher-content">
        <div className="teacher-actions">
          <div className="teacher-save-state" aria-live="polite">
            <strong>{dirty ? "Óvistaðar breytingar" : record.hasDraft ? "Drög vistuð" : "Birt útgáfa"}</strong>
            <span>Verk {selected} · {record.publishedAt ? "Síðast birt " + new Date(record.publishedAt).toLocaleString("is-IS") : "Upprunaleg útgáfa"}</span>
          </div>
          <div className="teacher-action-buttons">
            <button className="teacher-button" type="button" onClick={() => setPreview(!preview)}>{preview ? "Til baka í ritil" : "Forskoða"}</button>
            <button className="teacher-button" type={preview ? "button" : "submit"} onClick={() => { if (preview) void save("draft"); }} form="project-editor" value="draft" disabled={busy || !dirty}>Vista drög</button>
            <button className="teacher-button primary" type={preview ? "button" : "submit"} onClick={() => { if (preview) void save("publish"); }} form="project-editor" value="publish" disabled={busy || (!dirty && !record.hasDraft)}>{busy ? "Vista…" : "Birta fyrir nemendur"}</button>
          </div>
        </div>
        <div aria-live="polite">{message && <p className="teacher-notice success">{message}</p>}</div>
        {error && <p className="teacher-notice error" role="alert">{error}</p>}
        {preview && <section className="teacher-preview" aria-label="Forskoðun">
          <p className="teacher-notice">Forskoðun á breytingunum þínum. Smelltu á „Birta fyrir nemendur“ til að uppfæra verkefnið.</p>
          <ProjectBoard key={project.number} preview={project} />
        </section>}
        <form id="project-editor" hidden={preview} onSubmit={(event) => {
          event.preventDefault();
          const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          void save(button?.value === "publish" ? "publish" : "draft");
        }}>
          <fieldset disabled={busy}>
            <legend>Verk {selected} · Verkefnalýsing</legend>
            <label>Heiti verkefnis<input value={project.title} onChange={(e) => change("title", e.target.value)} required maxLength={200} /></label>
            <label>Inngangur<textarea value={project.intro} onChange={(e) => change("intro", e.target.value)} required maxLength={12000} rows={4} /></label>
            <label>Aðstæður eða erindi (valfrjálst)<textarea value={project.scenario ?? ""} onChange={(e) => change("scenario", e.target.value)} maxLength={12000} rows={4} /></label>
            <label>Nákvæm skil (valfrjálst)<textarea value={project.submission ?? ""} onChange={(e) => change("submission", e.target.value)} maxLength={12000} rows={4} /></label>
            <label>Verkfæri<textarea value={project.tools} onChange={(e) => change("tools", e.target.value)} required maxLength={4000} rows={2} /></label>
            <label>AI-regla<textarea value={project.ai} onChange={(e) => change("ai", e.target.value)} required maxLength={4000} rows={2} /></label>
          </fieldset>
          {project.levels.map((level, index) => (
            <fieldset className={"teacher-level " + level.key} key={level.key} disabled={busy}>
              <legend>Hluti {index + 1} · {level.points} stig</legend>
              <div className="teacher-field-pair">
                <label>Heiti hluta<input value={level.label} onChange={(e) => changeLevel(index, "label", e.target.value)} required maxLength={100} /></label>
                <label>Undirfyrirsögn<input value={level.kicker} onChange={(e) => changeLevel(index, "kicker", e.target.value)} required maxLength={200} /></label>
              </div>
              <label>Verkefni<textarea value={level.task} onChange={(e) => changeLevel(index, "task", e.target.value)} required maxLength={12000} rows={3} /></label>
              <label>Skref · eitt skref í hverri línu<textarea value={level.steps.join("\n")} onChange={(e) => changeLevel(index, "steps", e.target.value.split("\n"))} required rows={Math.max(5, level.steps.length + 1)} /></label>
              <label>Afhending úr þessum hluta<textarea value={level.deliverable} onChange={(e) => changeLevel(index, "deliverable", e.target.value)} required maxLength={12000} rows={3} /></label>
            </fieldset>
          ))}
          <p className="teacher-note">Stig, skilafrestur og matskvarði eru áfram stillt í Canvas. Birtar breytingar hér uppfæra textann í verkefnaborðinu.</p>
        </form>
      </div>
    </div>
  );
}
