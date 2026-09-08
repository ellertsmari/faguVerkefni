export const SCORES: number[];
export const CONTRIBUTION_LABELS: Record<string, string>;
export const TEAMWORK_LABELS: Record<string, string>;
export const BOOST_SCALE: number;
export const PENALTY_SCALE: number;
export const GRADE_MAX: number;
export function round1(value: number): number;
export function peerGradeFactor(contribution: number, teamwork: number): number;
export function individualGrade(groupGrade: number, contribution: number, teamwork: number): number;
export function normalizeName(name: string): string;

export type EvaluationEntry = {
  name: string;
  contribution: number | null;
  teamwork: number | null;
  reason: string;
  self: boolean;
};
export function validateEvaluation(entries: EvaluationEntry[]): string | null;
export function encodeEvaluation(input: { project: number; entries: EvaluationEntry[]; at?: Date }): string;

export type DecodedEvaluation = {
  project: number;
  at: string;
  evaluator: string;
  entries: { name: string; contribution: number; teamwork: number; reason: string }[];
};
export function decodeEvaluations(text: string): { evaluations: DecodedEvaluation[]; errors: string[] };

export type ReceivedScore = { from: string; self: boolean; contribution: number; teamwork: number; reason: string };
export type TeamMember = {
  name: string;
  received: ReceivedScore[];
  count: number;
  contributionAvg: number | null;
  teamworkAvg: number | null;
  submitted: boolean;
};
export type Team = { key: string; members: TeamMember[] };
export function aggregateEvaluations(evaluations: DecodedEvaluation[]): Team[];
