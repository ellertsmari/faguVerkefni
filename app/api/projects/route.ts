import { publishedProjects } from "../../../db/projects";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return Response.json({ projects: await publishedProjects() }, { headers });
  } catch (error) {
    console.error("Reading published projects failed", error);
    return Response.json({ error: "Ekki tókst að sækja verkefnin." }, { status: 503, headers });
  }
}
