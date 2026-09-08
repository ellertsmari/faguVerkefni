import { useEffect, useMemo, useState } from "react";

import {
  aggregateEvaluations,
  decodeEvaluations,
  individualGrade,
  peerGradeFactor,
  round1,
} from "./peer-grade.mjs";

// Teacher view. Paste every student's Canvas text here; nothing leaves the
// browser. The team's averages are advice; the confirmed figures are what
// the teacher decides, defaulting to those averages.

type Confirmed = Record<string, { contribution?: string; teamwork?: string }>;

const parseFigure = (raw: string | undefined, fallback: number) => {
  if (raw === undefined) return fallback;
  const number = Number(raw.replace(",", "."));
  return Number.isFinite(number) && raw.trim() !== "" ? Math.max(-2, Math.min(2, round1(number))) : fallback;
};
type Received = { from: string; self: boolean; contribution: number; teamwork: number; reason: string };
type Member = { name: string; received: Received[]; count: number; contributionAvg: number | null; teamworkAvg: number | null; submitted: boolean };
type Team = { key: string; members: Member[] };

const storageKey = "fagu-matsyfirlit";
const signed = (value: number | null) => value === null ? "–" : value > 0 ? `+${value}` : String(value);

export default function PeerReport() {
  const [saved] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) ?? "null") ?? {};
    } catch {
      return {};
    }
  });
  const [text, setText] = useState<string>(saved.text ?? "");
  const [groupGrades, setGroupGrades] = useState<Record<string, string>>(saved.groupGrades ?? {});
  const [confirmed, setConfirmed] = useState<Confirmed>(saved.confirmed ?? {});

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ text, groupGrades, confirmed }));
    } catch {
      // Keep working without persistence.
    }
  }, [text, groupGrades, confirmed]);

  const { evaluations, errors } = useMemo(() => decodeEvaluations(text), [text]);
  const teams = useMemo(() => aggregateEvaluations(evaluations) as Team[], [evaluations]);

  const confirmedFor = (team: Team, member: Member) => {
    const entry = confirmed[`${team.key}::${member.name}`] ?? {};
    return {
      contribution: parseFigure(entry.contribution, member.contributionAvg ?? 0),
      teamwork: parseFigure(entry.teamwork, member.teamworkAvg ?? 0),
    };
  };

  function setFigure(team: Team, member: Member, axis: "contribution" | "teamwork", value: string) {
    const key = `${team.key}::${member.name}`;
    setConfirmed((current) => ({ ...current, [key]: { ...current[key], [axis]: value } }));
  }

  function copyTable() {
    const rows = [["Hópur", "Nafn", "Skilaði mati", "Fjöldi mata", "Framlag meðaltal", "Samvinna meðaltal", "Framlag staðfest", "Samvinna staðfest", "Stuðull", "Hópeinkunn", "Einkunn"]];
    teams.forEach((team, teamIndex) => {
      const groupGrade = Number(groupGrades[team.key]?.replace(",", "."));
      for (const member of team.members) {
        const figures = confirmedFor(team, member);
        rows.push([
          String(teamIndex + 1), member.name, member.submitted ? "já" : "nei", String(member.count),
          signed(member.contributionAvg), signed(member.teamworkAvg),
          signed(figures.contribution), signed(figures.teamwork),
          peerGradeFactor(figures.contribution, figures.teamwork).toFixed(3),
          Number.isFinite(groupGrade) ? String(groupGrade) : "",
          Number.isFinite(groupGrade) ? String(individualGrade(groupGrade, figures.contribution, figures.teamwork)) : "",
        ]);
      }
    });
    void navigator.clipboard.writeText(rows.map((row) => row.join("\t")).join("\n"));
  }

  return (
    <main className="site-shell eval-shell">
      <header className="topbar">
        <div className="brand"><span>FAGU</span><i /> MATSYFIRLIT · KENNARI</div>
        <div className="status"><b>{evaluations.length}</b> MÖT · {teams.length} HÓPAR</div>
      </header>

      <article className="project eval">
        <div className="project-heading">
          <div className="project-index">MAT</div>
          <div>
            <p className="eyebrow">JAFNINGJAMAT · YFIRLIT</p>
            <h2>Frá matstextum í einkunnir</h2>
            <p>Opnaðu SpeedGrader fyrir „Jafningjamat Verk 7“, afritaðu textann úr hverjum skilum og límdu allt hér, í hvaða röð sem er. Allt er reiknað í vafranum þínum og vistað þar; ekkert er sent neitt.</p>
          </div>
        </div>

        <label className="eval-paste">Límdu alla matstexta hér<textarea value={text} onChange={(event) => setText(event.target.value)} rows={8} placeholder="JAFNINGJAMAT · VERK 7 … KÓÐI: …" /></label>
        {errors.length > 0 && <p className="eval-error" role="alert">{errors.length} kóði var ólæsilegur. Athugaðu að KÓÐI-línan hafi afritast heil.</p>}

        <aside className="scenario">
          <h3>Reikniregla</h3>
          <p>P = (framlag + 2) × (samvinna + 2) − 4, á bilinu −4 til +12. Stuðull = 1 + P × 0,025 þegar P er núll eða hærra, annars 1 + P × 0,175. Einkunn nemanda = hópeinkunn × stuðull, að hámarki 10. Það gefur mest +30% og minnst −70%. Meðaltölin eru ráðgefandi; staðfestu tölurnar sem þú telur réttar, sjálfgefið eru þær meðaltölin.</p>
        </aside>

        {teams.map((team, teamIndex) => {
          const groupGrade = Number((groupGrades[team.key] ?? "").replace(",", "."));
          const hasGrade = Number.isFinite(groupGrade) && groupGrades[team.key] !== undefined && groupGrades[team.key] !== "";
          return (
            <section className="eval-team" key={team.key} aria-labelledby={`team-${teamIndex}`}>
              <div className="eval-team-head">
                <h3 id={`team-${teamIndex}`}>Hópur {teamIndex + 1}: {team.members.map((member) => member.name).join(", ")}</h3>
                <label>Hópeinkunn (0–10)<input inputMode="decimal" value={groupGrades[team.key] ?? ""} onChange={(event) => setGroupGrades((current) => ({ ...current, [team.key]: event.target.value }))} placeholder="t.d. 8,5" /></label>
              </div>
              <div className="table-wrap">
                <table className="eval-table">
                  <thead>
                    <tr><th>Nafn</th><th>Skilaði</th><th>Möt</th><th>Framlag<br /><small>meðaltal</small></th><th>Samvinna<br /><small>meðaltal</small></th><th>Framlag<br /><small>staðfest</small></th><th>Samvinna<br /><small>staðfest</small></th><th>Stuðull</th><th>Einkunn</th></tr>
                  </thead>
                  <tbody>
                    {team.members.map((member) => {
                      const figures = confirmedFor(team, member);
                      const factor = peerGradeFactor(figures.contribution, figures.teamwork);
                      const changed = figures.contribution !== (member.contributionAvg ?? 0) || figures.teamwork !== (member.teamworkAvg ?? 0);
                      return (
                        <tr key={member.name} className={member.submitted ? "" : "missing"}>
                          <td>{member.name}</td>
                          <td>{member.submitted ? "já" : "nei"}</td>
                          <td>{member.count}</td>
                          <td>{signed(member.contributionAvg)}</td>
                          <td>{signed(member.teamworkAvg)}</td>
                          <td><input inputMode="decimal" aria-label={`Framlag staðfest: ${member.name}`} value={confirmed[`${team.key}::${member.name}`]?.contribution ?? String(figures.contribution)} onChange={(event) => setFigure(team, member, "contribution", event.target.value)} /></td>
                          <td><input inputMode="decimal" aria-label={`Samvinna staðfest: ${member.name}`} value={confirmed[`${team.key}::${member.name}`]?.teamwork ?? String(figures.teamwork)} onChange={(event) => setFigure(team, member, "teamwork", event.target.value)} /></td>
                          <td>{factor.toFixed(2)}{changed && <small title="Breytt frá meðaltali"> breytt</small>}</td>
                          <td><b>{hasGrade ? individualGrade(groupGrade, figures.contribution, figures.teamwork) : "–"}</b></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <details>
                <summary>Rökstuðningur hópsins</summary>
                <div className="guide-content">
                  {team.members.map((member) => (
                    <div key={member.name} className="eval-reasons">
                      <h4>{member.name}</h4>
                      <ul>
                        {member.received.map((received, index) => (
                          <li key={index}><b>{received.self ? "sjálfsmat" : received.from}:</b> framlag {signed(received.contribution)}, samvinna {signed(received.teamwork)}. {received.reason}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </section>
          );
        })}

        {teams.length > 0 && <div className="eval-actions">
          <button type="button" className="teacher-button primary" onClick={copyTable}>Afrita töflu fyrir Excel</button>
          <button type="button" className="teacher-button" onClick={() => { if (window.confirm("Hreinsa allt sem er hér?")) { setText(""); setGroupGrades({}); setConfirmed({}); } }}>Hreinsa</button>
        </div>}
      </article>
    </main>
  );
}
