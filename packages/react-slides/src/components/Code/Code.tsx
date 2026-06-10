import { useContext, useLayoutEffect } from "react"
import { Highlight } from "prism-react-renderer"
import { DeckContext } from "../../context/DeckContext"
import { StepsContext } from "../../context/StepsContext"
import styles from "./Code.module.css"
import { cssVarTheme } from "./theme"

interface CodeProps {
  code: string
  language?: string
  /** Static highlight spec ("2", "1,4", "3-5,8") or an array of specs to step
   *  through one per slide step. 1-based line numbers. */
  highlight?: string | string[]
  /** Show the line-number gutter. Defaults to true. */
  showLineNumbers?: boolean
}

/** Parse a range spec like "1,3-5,8" into a Set of 1-based line numbers. */
function parseRanges(spec?: string): Set<number> {
  const lines = new Set<number>()
  if (!spec) return lines
  for (const part of spec.split(",")) {
    const [a, b] = part.split("-").map((s) => parseInt(s.trim(), 10))
    if (Number.isNaN(a)) continue
    const end = b === undefined || Number.isNaN(b) ? a : b
    for (let n = a; n <= end; n++) lines.add(n)
  }
  return lines
}

export function Code({ code, language = "tsx", highlight, showLineNumbers = true }: CodeProps) {
  const register = useContext(StepsContext)
  const { step } = useContext(DeckContext)

  // When highlight is an array, register step count and pick the active spec
  const highlightStepCount = Array.isArray(highlight) ? highlight.length : 0

  useLayoutEffect(() => {
    if (highlightStepCount === 0) return
    register(highlightStepCount - 1)
    return () => register(0)
  }, [highlightStepCount, register])

  const activeHighlight = Array.isArray(highlight)
    ? highlight[Math.min(step, highlight.length - 1)]
    : highlight

  const highlighted = parseRanges(activeHighlight)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {language && <span className={styles.language}>{language}</span>}
      </div>
      <Highlight code={code.trim()} language={language} theme={cssVarTheme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={styles.pre}>
            <code>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({ line })
                const isHot = highlighted.has(i + 1)
                return (
                  <span
                    key={i}
                    {...lineProps}
                    className={`${styles.line} ${isHot ? styles.lineHot : ""}`}
                  >
                    {showLineNumbers && <span className={styles.lineNo}>{i + 1}</span>}
                    <span className={styles.lineContent}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </span>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
