// Peer and self evaluation for group projects.
//
// Same model as Vefskólinn's group projects: every student rates themselves
// and each teammate on two axes, contribution and teamwork, from -2 to +2,
// with a written reason. Scores are relative, so per evaluator and per axis
// they must add up to zero or less: a team cannot rate itself above its own
// average. What the team writes is advice; the teacher confirms figures, and
// those turn the group grade into each student's own.
//
// Plain JavaScript so the same code runs in the browser and in the Node tests.

export const SCORES = [-2, -1, 0, 1, 2];

export const CONTRIBUTION_LABELS = {
  "-2": "Vann ekkert",
  "-1": "Minna en aðrir",
  "0": "Jafnt og aðrir",
  "1": "Meira en aðrir",
  "2": "Mest af vinnunni",
};

export const TEAMWORK_LABELS = {
  "-2": "Engin samskipti",
  "-1": "Hjálpaði sjaldan",
  "0": "Eðlileg samvinna",
  "1": "Hjálpaði öðrum virkt",
  "2": "Hélt hópnum saman",
};

export const BOOST_SCALE = 0.025; // up to +30%
export const PENALTY_SCALE = 0.175; // down to -70%
export const GRADE_MAX = 10;

export const round1 = (value) => Math.round(value * 10) / 10;

/** Multiplier applied to the group grade for confirmed figures on the -2..+2 scale. */
export function peerGradeFactor(contribution, teamwork) {
  const p = (contribution + 2) * (teamwork + 2) - 4;
  return p * (p >= 0 ? BOOST_SCALE : PENALTY_SCALE) + 1;
}

export function individualGrade(groupGrade, contribution, teamwork) {
  const raw = groupGrade * peerGradeFactor(contribution, teamwork);
  return round1(Math.min(GRADE_MAX, Math.max(0, raw)));
}

export const normalizeName = (name) => name.trim().replace(/\s+/g, " ").toLocaleLowerCase("is");

/**
 * Checks one student's complete evaluation of their team.
 * entries: [{ name, contribution, teamwork, reason, self }]
 * Returns an Icelandic error message, or null when the evaluation is valid.
 */
export function validateEvaluation(entries) {
  if (!Array.isArray(entries) || entries.length < 2) return "Hópurinn þarf að vera að minnsta kosti tveir, þú og einn til.";
  const seen = new Set();
  for (const entry of entries) {
    const name = typeof entry.name === "string" ? entry.name.trim() : "";
    if (!name) return "Skráðu nafn allra í hópnum.";
    const key = normalizeName(name);
    if (seen.has(key)) return `Nafnið „${name}“ kemur fyrir oftar en einu sinni.`;
    seen.add(key);
    for (const axis of ["contribution", "teamwork"]) {
      if (!SCORES.includes(entry[axis])) return `Veldu bæði framlag og samvinnu fyrir ${name}.`;
    }
    if (typeof entry.reason !== "string" || !entry.reason.trim()) return `Skrifaðu stutta rökstuðning fyrir ${name}.`;
  }
  if (entries.filter((entry) => entry.self).length !== 1) return "Merktu nákvæmlega eina línu sem þig sjálfa/n.";
  for (const [axis, label] of [["contribution", "Framlag"], ["teamwork", "Samvinna"]]) {
    const balance = entries.reduce((sum, entry) => sum + entry[axis], 0);
    if (balance > 0) return `${label}: stigin leggjast saman í +${balance}. Hópur getur ekki verið yfir eigin meðaltali. Taktu ${balance === 1 ? "1 stig" : balance + " stig"} til baka.`;
  }
  return null;
}

const CODE_PREFIX = "KÓÐI:";

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(code) {
  const binary = atob(code.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** The text a student pastes into Canvas: readable lines plus one machine-readable line. */
export function encodeEvaluation({ project, entries, at = new Date() }) {
  const self = entries.find((entry) => entry.self);
  const lines = [
    `JAFNINGJAMAT · VERK ${project}`,
    `Matsaðili: ${self.name.trim()}`,
    `Dagsetning: ${at.toISOString().slice(0, 10)}`,
    "",
  ];
  for (const entry of entries) {
    const who = entry.self ? `${entry.name.trim()} (ég)` : entry.name.trim();
    lines.push(`${who} · Framlag ${signed(entry.contribution)} (${CONTRIBUTION_LABELS[entry.contribution]}) · Samvinna ${signed(entry.teamwork)} (${TEAMWORK_LABELS[entry.teamwork]})`);
    lines.push(`  Rök: ${entry.reason.trim()}`);
  }
  const payload = {
    v: 1,
    project,
    at: at.toISOString(),
    evaluator: self.name.trim(),
    entries: entries.map((entry) => ({
      name: entry.name.trim(),
      c: entry.contribution,
      t: entry.teamwork,
      reason: entry.reason.trim(),
    })),
  };
  lines.push("", `${CODE_PREFIX} ${toBase64(JSON.stringify(payload))}`);
  return lines.join("\n");
}

const signed = (value) => (value > 0 ? `+${value}` : String(value));

/**
 * Finds every KÓÐI line in pasted text and decodes it.
 * Returns { evaluations, errors } so one bad paste does not hide the rest.
 */
export function decodeEvaluations(text) {
  const evaluations = [];
  const errors = [];
  const pattern = new RegExp(`${CODE_PREFIX}\\s*([A-Za-z0-9+/=]+)`, "g");
  for (const match of String(text).matchAll(pattern)) {
    try {
      const payload = JSON.parse(fromBase64(match[1]));
      if (payload.v !== 1 || !Array.isArray(payload.entries) || !payload.evaluator) throw new Error("bad payload");
      evaluations.push({
        project: Number(payload.project),
        at: payload.at,
        evaluator: String(payload.evaluator),
        entries: payload.entries.map((entry) => ({
          name: String(entry.name),
          contribution: Number(entry.c),
          teamwork: Number(entry.t),
          reason: String(entry.reason ?? ""),
        })),
      });
    } catch {
      errors.push(match[1].slice(0, 16) + "…");
    }
  }
  return { evaluations, errors };
}

/**
 * Groups evaluations into teams by the set of names they mention, then
 * averages what each member received, self-evaluation included.
 * Where the same evaluator pasted twice, the latest wins.
 */
export function aggregateEvaluations(evaluations) {
  const latest = new Map();
  for (const evaluation of evaluations) {
    const key = normalizeName(evaluation.evaluator);
    const existing = latest.get(key);
    if (!existing || String(evaluation.at) > String(existing.at)) latest.set(key, evaluation);
  }
  const teams = new Map();
  for (const evaluation of latest.values()) {
    const members = evaluation.entries.map((entry) => entry.name.trim());
    const teamKey = members.map(normalizeName).sort().join("|");
    let team = teams.get(teamKey);
    if (!team) {
      team = { key: teamKey, members: new Map(), evaluators: [] };
      for (const member of members) team.members.set(normalizeName(member), { name: member, received: [] });
      teams.set(teamKey, team);
    }
    team.evaluators.push(normalizeName(evaluation.evaluator));
    for (const entry of evaluation.entries) {
      const member = team.members.get(normalizeName(entry.name));
      if (!member) continue;
      member.received.push({
        from: evaluation.evaluator,
        self: normalizeName(evaluation.evaluator) === normalizeName(entry.name),
        contribution: entry.contribution,
        teamwork: entry.teamwork,
        reason: entry.reason,
      });
    }
  }
  return [...teams.values()].map((team) => ({
    key: team.key,
    members: [...team.members.values()].map((member) => {
      const count = member.received.length;
      const contribution = count ? member.received.reduce((sum, r) => sum + r.contribution, 0) / count : null;
      const teamwork = count ? member.received.reduce((sum, r) => sum + r.teamwork, 0) / count : null;
      return {
        name: member.name,
        received: member.received,
        count,
        contributionAvg: contribution === null ? null : round1(contribution),
        teamworkAvg: teamwork === null ? null : round1(teamwork),
        submitted: team.evaluators.includes(normalizeName(member.name)),
      };
    }),
  }));
}
