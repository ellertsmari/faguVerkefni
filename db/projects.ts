import { defaultProjects, type Project } from "../app/project-data";
import { getContentDb } from "./index";

export type EditorRecord = {
  project: Project;
  revision: number;
  hasDraft: boolean;
  publishedAt: string | null;
};

type ContentRow = {
  number: number;
  published_json: string | null;
  draft_json: string | null;
  revision: number;
  published_at: string | null;
};

async function rows() {
  const result = await getContentDb().prepare(
    "SELECT number, published_json, draft_json, revision, published_at FROM project_content",
  ).all<ContentRow>();
  return new Map(result.results.map((row) => [row.number, row]));
}

export async function publishedProjects(): Promise<Project[]> {
  const content = await rows();
  return defaultProjects.map((original) => {
    const row = content.get(original.number);
    return row?.published_json ? JSON.parse(row.published_json) : original;
  });
}

export async function editorProjects(): Promise<EditorRecord[]> {
  const content = await rows();
  return defaultProjects.map((original) => {
    const row = content.get(original.number);
    const json = row?.draft_json ?? row?.published_json;
    return {
      project: json ? JSON.parse(json) : original,
      revision: row?.revision ?? 0,
      hasDraft: Boolean(row?.draft_json),
      publishedAt: row?.published_at ?? null,
    };
  });
}

export async function saveProject(project: Project, revision: number, action: "draft" | "publish") {
  const db = getContentDb();
  const json = JSON.stringify(project);
  const now = new Date().toISOString();
  const publish = action === "publish";
  // Compare-and-swap prevents a stale tab from overwriting newer teacher edits.
  const statement = revision === 0
    ? db.prepare(`INSERT INTO project_content
        (number, published_json, draft_json, revision, updated_at, published_at)
        VALUES (?, ?, ?, 1, ?, ?) ON CONFLICT(number) DO NOTHING RETURNING revision`)
      .bind(project.number, publish ? json : null, publish ? null : json, now, publish ? now : null)
    : publish
      ? db.prepare(`UPDATE project_content SET published_json = ?, draft_json = NULL,
          revision = revision + 1, updated_at = ?, published_at = ?
          WHERE number = ? AND revision = ? RETURNING revision`)
        .bind(json, now, now, project.number, revision)
      : db.prepare(`UPDATE project_content SET draft_json = ?, revision = revision + 1,
          updated_at = ? WHERE number = ? AND revision = ? RETURNING revision`)
        .bind(json, now, project.number, revision);
  const saved = await statement.first<{ revision: number }>();
  return saved ? { revision: saved.revision, publishedAt: publish ? now : null } : null;
}
