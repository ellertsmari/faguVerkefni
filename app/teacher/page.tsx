import { getChatGPTUser, chatGPTSignInPath, chatGPTSignOutPath } from "../chatgpt-auth";
import { getTeacher } from "./auth";
import Editor from "./editor";
import Link from "next/link";
import "./teacher.css";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  const user = await getChatGPTUser();
  const teacher = await getTeacher();
  if (!teacher) {
    return (
      <main className="teacher-shell teacher-login">
        <p className="eyebrow">FAGU · KENNARAAÐGANGUR</p>
        <h1>Breyttu verkefnum.</h1>
        <p>Vistaðu drög og birtu breytingar fyrir nemendur án AI-notkunar.</p>
        {user ? <>
          <p role="alert">Þessi reikningur hefur ekki kennaraaðgang.</p>
          <a className="teacher-button primary" href={chatGPTSignOutPath("/teacher")} target="_top">Skipta um reikning</a>
        </> : <a className="teacher-button primary" href={chatGPTSignInPath("/teacher")} target="_top">Skrá inn með ChatGPT</a>}
        <Link href="/" target="_top">Opna verkefnaborð</Link>
      </main>
    );
  }
  return (
    <main className="teacher-shell">
      <header className="teacher-header">
        <div><p className="eyebrow">FAGU · KENNARAAÐGANGUR</p><h1>Verkefnin þín.</h1></div>
        <nav aria-label="Kennaraaðgangur">
          <a href="/" target="_blank" rel="noreferrer">Skoða sem nemandi</a>
          <a href={chatGPTSignOutPath("/teacher")} target="_top">Skrá út</a>
        </nav>
      </header>
      <p className="teacher-intro">Breyttu textanum og vistaðu drög eða birtu fyrir nemendur. Birtar breytingar sjást í Canvas þegar verkefnið er opnað aftur og opnar síður uppfærast sjálfkrafa.</p>
      <Editor />
    </main>
  );
}
