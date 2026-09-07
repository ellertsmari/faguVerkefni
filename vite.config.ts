import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The site is served from https://ellertsmari.github.io/faguVerkefni/.
// Override with VITE_BASE=/ when hosting at a domain root.
export default defineConfig({
  base: process.env.VITE_BASE ?? "/faguVerkefni/",
  plugins: [react()],
  build: { outDir: "dist" },
});
