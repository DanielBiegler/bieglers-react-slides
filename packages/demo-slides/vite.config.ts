import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"
import type { Plugin, HtmlTagDescriptor } from "vite"

const FONT_MIME_TYPES: Record<string, string> = {
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
}

function preloadPresentationAssets(): Plugin {
  let base = "/"
  return {
    name: "preload-presentation-assets",
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return []
        const tags: HtmlTagDescriptor[] = []
        for (const [fileName, chunk] of Object.entries(ctx.bundle)) {
          if (chunk.type !== "asset") continue
          const href = `${base}${fileName}`
          const fontMatch = fileName.match(/\.(woff2?|ttf|otf|eot)$/i)
          if (fontMatch) {
            tags.push({
              tag: "link",
              attrs: { rel: "preload", href, as: "font", type: FONT_MIME_TYPES[fontMatch[1].toLowerCase()], crossorigin: "anonymous" },
              injectTo: "head",
            })
          } else if (/\.(jpe?g|png|webp|avif|gif)$/i.test(fileName)) {
            tags.push({
              tag: "link",
              attrs: { rel: "preload", href, as: "image" },
              injectTo: "head",
            })
          }
        }
        return tags
      },
    },
  }
}

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/bieglers-react-slides/" : "/",
  plugins: [react(), preloadPresentationAssets()],
  resolve: {
    alias: {
      "@danielbiegler/react-slides": resolve(
        __dirname,
        "../react-slides/src/index.ts"
      ),
    },
  },
}))
