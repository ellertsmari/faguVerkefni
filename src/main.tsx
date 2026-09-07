import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ProjectBoard from "./project-board";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProjectBoard />
  </StrictMode>,
);
