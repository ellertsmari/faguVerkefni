import { editorProjects, saveProject } from "../../../../db/projects";
import { getTeacher } from "../../../teacher/auth";
import { validateProject } from "../../../project-validation";

export const dynamic = "force-dynamic";
const responseHeaders = { "Cache-Control": "no-store" };
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: responseHeaders });

export async function GET() {
  if (!await getTeacher()) return json({ error: "Kennaraaðgangur er nauðsynlegur." }, 403);
  try {
    return json({ records: await editorProjects() });
  } catch (error) {
    console.error("Reading teacher projects failed", error);
    return json({ error: "Ekki tókst að sækja verkefnin. Reyndu aftur." }, 503);
  }
}

export async function PUT(request: Request) {
  if (!await getTeacher()) return json({ error: "Skráðu þig inn aftur með kennaraaðgangi." }, 403);
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ error: "Óheimil beiðni." }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "Ógild gögn." }, 415);
  }
  let project;
  let revision;
  let action;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 100000) return json({ error: "Textinn er of langur." }, 413);
    const data = JSON.parse(body);
    revision = data.revision;
    action = data.action;
    if (!Number.isSafeInteger(revision) || revision < 0 || (action !== "draft" && action !== "publish")) {
      return json({ error: "Ógild vistun." }, 400);
    }
    project = validateProject(data.project);
  } catch {
    return json({ error: "Athugaðu að allir reitir séu útfylltir og að hver hluti hafi 1–30 skref." }, 400);
  }
  try {
    const saved = await saveProject(project, revision, action);
    if (!saved) return json({ error: "Verkefninu var breytt í öðrum glugga. Afritaðu breytingarnar þínar áður en þú endurhleður síðuna." }, 409);
    return json({ project, ...saved, hasDraft: action === "draft" });
  } catch (error) {
    console.error("Saving teacher project failed", error);
    return json({ error: "Ekki tókst að vista. Breytingarnar þínar eru enn í ritlinum. Reyndu aftur." }, 503);
  }
}
