import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { preloadPresentationAssets } from "../react-slides/src/vite-plugin"

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/bieglers-react-slides/" : "/",
  plugins: [react(), preloadPresentationAssets()],
  resolve: {
    alias: {
      "@danielbiegler/react-slides/vite-plugin": resolve(__dirname, "../react-slides/src/vite-plugin.ts"),
      "@danielbiegler/react-slides": resolve(__dirname, "../react-slides/src/index.ts"),
    },
  },
}))
