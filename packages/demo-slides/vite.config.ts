import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@danielbiegler/react-slides": resolve(
        __dirname,
        "../react-slides/src/index.ts"
      ),
    },
  },
})
