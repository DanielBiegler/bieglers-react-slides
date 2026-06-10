import { ReactNode, useContext, useLayoutEffect } from "react"
import { DeckContext } from "../../context/DeckContext"
import { StepsContext } from "../../context/StepsContext"
import styles from "./Cards.module.css"

type BorderSide = "left" | "top" | "right" | "bottom"

export interface CardItem {
  /** String renders as a styled <h3>; any other ReactNode renders as-is. */
  title: ReactNode
  /** String renders as a styled <p>; any other ReactNode renders as-is. */
  description: ReactNode
  /** Override the accent color for this card (any CSS color). Defaults to --rs-accent. */
  accent?: string
  /** Override the border side for this card. Defaults to the layout-level `border`. */
  border?: BorderSide
}

interface CardsProps {
  cards: CardItem[]
  /** Optional heading above the card grid. */
  title?: string
  /** Default border side for all cards. Per-card `border` takes precedence. Default: "top". */
  border?: BorderSide
  /** Reveal cards one by one as the presenter advances. Step 0 = title only. */
  reveal?: boolean
  /** Non-visual helpers such as <Footnote> or <Notes>. */
  children?: ReactNode
}

export function Cards({ cards, title, border = "top", reveal, children }: CardsProps) {
  const register = useContext(StepsContext)
  const { step } = useContext(DeckContext)

  const visible = cards.slice(0, 6)

  useLayoutEffect(() => {
    if (!reveal) return
    register(visible.length)
    return () => register(0)
  }, [reveal, visible.length, register])

  return (
    <div className={styles.root}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      <div className={styles.grid} data-count={visible.length}>
        {visible.map((card, i) => {
          const isVisible = !reveal || step > i
          const side = card.border ?? border
          const color = card.accent ?? "var(--rs-accent)"
          return (
            <div
              key={i}
              className={`${styles.card}${reveal ? ` ${styles.revealCard}` : ""}${reveal && !isVisible ? ` ${styles.cardHidden}` : ""}`}
              data-border={side}
              style={{ "--rs-card-accent": color } as React.CSSProperties}
            >
              {typeof card.title === "string"
                ? <h3 className={styles.cardTitle}>{card.title}</h3>
                : card.title}
              {typeof card.description === "string"
                ? <p className={styles.cardDescription}>{card.description}</p>
                : card.description}
            </div>
          )
        })}
      </div>
      {children}
    </div>
  )
}
