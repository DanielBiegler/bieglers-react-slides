type SansFonts =
  | "var(--rs-font-inter)"
  | "var(--rs-font-plus-jakarta)"
  | "var(--rs-font-bricolage-grotesque)"
  | "var(--rs-font-unbounded)"

type SerifFonts =
  | "var(--rs-font-fraunces)"
  | "var(--rs-font-newsreader)"
  | "var(--rs-font-playfair)"

export interface Overrides {
  // Typography
  "--rs-font-sans"?: SansFonts | (string & {})
  "--rs-font-serif"?: SerifFonts | (string & {})
  "--rs-font-mono"?: string
  "--rs-font-heading"?: SansFonts | SerifFonts | (string & {})
  "--rs-font-size-h1"?: string
  "--rs-font-size-h3"?: string
  "--rs-font-size-base"?: string
  "--rs-font-size-small"?: string
  "--rs-font-weight-heading"?: string
  "--rs-font-weight-body"?: string
  // Design
  "--rs-accent"?: string
  "--rs-bg"?: string
  "--rs-color"?: string
  "--rs-color-muted"?: string
  "--rs-slide-padding"?: string
  "--rs-gap"?: string
  "--rs-radius"?: string
}
