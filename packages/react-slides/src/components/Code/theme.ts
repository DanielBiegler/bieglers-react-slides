import type { PrismTheme } from "prism-react-renderer"

/**
 * Token colors are driven by CSS custom properties (see tokens.css) so the
 * existing light/dark theming applies to syntax highlighting automatically.
 */
export const cssVarTheme: PrismTheme = {
  plain: {
    color: "var(--rs-color)",
    backgroundColor: "transparent",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--rs-syntax-comment)", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "var(--rs-syntax-punctuation)" } },
    { types: ["keyword", "atrule", "important", "selector", "rule"], style: { color: "var(--rs-syntax-keyword)" } },
    { types: ["string", "char", "attr-value", "regex", "url"], style: { color: "var(--rs-syntax-string)" } },
    { types: ["function", "class-name", "builtin", "inserted"], style: { color: "var(--rs-syntax-function)" } },
    { types: ["number", "boolean", "constant", "symbol"], style: { color: "var(--rs-syntax-number)" } },
    { types: ["tag", "operator", "deleted", "entity"], style: { color: "var(--rs-syntax-tag)" } },
    { types: ["attr-name", "property", "variable"], style: { color: "var(--rs-syntax-variable)" } },
  ],
}
