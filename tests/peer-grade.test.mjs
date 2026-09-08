import assert from "node:assert/strict";
import test from "node:test";

import {
  aggregateEvaluations,
  decodeEvaluations,
  encodeEvaluation,
  individualGrade,
  peerGradeFactor,
  validateEvaluation,
} from "../src/peer-grade.mjs";

const team = (overrides = {}) => [
  { name: "Anna", contribution: 0, teamwork: 0, reason: "Gerði grunnmyndina.", self: true },
  { name: "Bjarni", contribution: 0, teamwork: 0, reason: "Fann verðin.", self: false },
  { name: "Dóra", contribution: 0, teamwork: 0, reason: "Smíðaði rásina.", self: false },
].map((entry) => ({ ...entry, ...(overrides[entry.name] ?? {}) }));

test("grade factor matches the vefskóli formula", () => {
  const factor = (c, t) => Number(peerGradeFactor(c, t).toFixed(3));
  assert.equal(factor(0, 0), 1);
  assert.equal(factor(2, 2), 1.3);
  assert.equal(factor(-2, -2), 0.3);
  // Carried the work but impossible to work with: keeps 30%, not average.
  assert.equal(factor(2, -2), 0.3);
  assert.equal(individualGrade(8, 0, 0), 8);
  assert.equal(individualGrade(8, 2, 2), 10); // capped at 10
  assert.equal(individualGrade(8, -1, -1), 3.8);
});

test("balance rule: a team cannot be rated above its own average", () => {
  assert.equal(validateEvaluation(team()), null);
  assert.match(validateEvaluation(team({ Anna: { contribution: 2 } })), /Framlag.*\+2/);
  assert.equal(validateEvaluation(team({ Anna: { contribution: 1 }, Bjarni: { contribution: -1 } })), null);
  assert.equal(validateEvaluation(team({ Anna: { teamwork: -1 }, Bjarni: { teamwork: -2 } })), null);
  assert.match(validateEvaluation(team({ Dóra: { reason: " " } })), /rökstuðning/);
  assert.match(validateEvaluation(team({ Dóra: { name: "anna " } })), /oftar en einu sinni/);
  assert.match(validateEvaluation(team({ Bjarni: { contribution: null } })), /Veldu/);
  assert.match(validateEvaluation(team().slice(0, 1)), /tveir/);
});

test("Canvas text round-trips through the KÓÐI line and aggregates per team", () => {
  const anna = encodeEvaluation({ project: 7, entries: team({ Anna: { contribution: -1 }, Dóra: { contribution: 1, teamwork: 1 }, Bjarni: { teamwork: -1 } }), at: new Date("2026-09-21T12:00:00Z") });
  assert.match(anna, /^JAFNINGJAMAT · VERK 7\nMatsaðili: Anna\n/);
  assert.match(anna, /Dóra · Framlag \+1 \(Meira en aðrir\) · Samvinna \+1/);
  const bjarni = encodeEvaluation({ project: 7, entries: team({ Bjarni: { self: true }, Anna: { self: false } }) });
  const pasted = `${anna}\n\n--- annar nemandi ---\n\n${bjarni}\nKÓÐI: !!!ekki gilt`;
  const { evaluations, errors } = decodeEvaluations(pasted);
  assert.equal(evaluations.length, 2);
  assert.equal(errors.length, 0, "an invalid code without base64 characters is simply not matched");
  const teams = aggregateEvaluations(evaluations);
  assert.equal(teams.length, 1);
  const byName = Object.fromEntries(teams[0].members.map((member) => [member.name, member]));
  assert.equal(byName.Dóra.count, 2);
  assert.equal(byName.Dóra.contributionAvg, 0.5);
  assert.equal(byName.Dóra.teamworkAvg, 0.5);
  assert.equal(byName.Dóra.submitted, false);
  assert.equal(byName.Anna.submitted, true);
  assert.ok(byName.Anna.received.some((r) => r.self));
});
