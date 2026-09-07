import { defaultProjects, type Project } from "./project-data";

function requiredText(value: unknown, limit: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > limit) {
    throw new Error("Fylltu út alla reiti og athugaðu lengd textans.");
  }
  return value.trim();
}

export function validateProject(value: unknown): Project {
  if (!value || typeof value !== "object") throw new Error("Verkefni vantar.");
  const data = value as Record<string, unknown>;
  const original = defaultProjects.find((project) => project.number === data.number);
  if (!original) throw new Error("Óþekkt verkefni.");
  if (data.canvasId !== original.canvasId) throw new Error("Verkefnaröð hefur breyst. Endurhlaðið ritlinum.");
  if (!Array.isArray(data.levels) || data.levels.length !== 3) {
    throw new Error("Verkefnið þarf að hafa þrjá hluta.");
  }
  return {
    ...original,
    title: requiredText(data.title, 200),
    intro: requiredText(data.intro, 12000),
    tools: requiredText(data.tools, 4000),
    ai: requiredText(data.ai, 4000),
    scenario: typeof data.scenario === "string" && data.scenario.trim() ? requiredText(data.scenario, 12000) : undefined,
    submission: typeof data.submission === "string" && data.submission.trim() ? requiredText(data.submission, 12000) : undefined,
    levels: original.levels.map((originalLevel, index) => {
      const level = (data.levels as Record<string, unknown>[])[index];
      if (!level || level.key !== originalLevel.key || !Array.isArray(level.steps) ||
          level.steps.length < 1 || level.steps.length > 30) {
        throw new Error("Hver hluti þarf 1–30 skref í réttri röð.");
      }
      return {
        ...originalLevel,
        label: requiredText(level.label, 100),
        kicker: requiredText(level.kicker, 200),
        task: requiredText(level.task, 12000),
        steps: level.steps.map((step: unknown) => requiredText(step, 4000)),
        deliverable: requiredText(level.deliverable, 12000),
      };
    }),
  };
}
