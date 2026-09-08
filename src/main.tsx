import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ProjectBoard from "./project-board";
import PeerEval from "./peer-eval";
import PeerReport from "./peer-report";
import "./globals.css";

// Three views share one static page, chosen by the `view` URL parameter:
// the student board (default), the peer evaluation form students fill in
// after a group presentation, and the teacher's summary of pasted results.
const view = new URLSearchParams(window.location.search).get("view");
const page = view === "jafningjamat" ? <PeerEval /> : view === "matsyfirlit" ? <PeerReport /> : <ProjectBoard />;

createRoot(document.getElementById("root")!).render(
  <StrictMode>{page}</StrictMode>,
);
