import { ReactNode } from "react"
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
  /** Default border side for all cards. Per-card `border` takes precedence. Default: "left". */
  border?: BorderSide
  /** Non-visual helpers such as <Footnote> or <Notes>. */
  children?: ReactNode
}

export function Cards({ cards, title, border = "top", children }: CardsProps) {
  const visible = cards.slice(0, 6)
  return (
    <div className={styles.root}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      <div className={styles.grid} data-count={visible.length}>
        {visible.map((card, i) => {
          const side = card.border ?? border
          const color = card.accent ?? "var(--rs-accent)"
          return (
            <div
              key={i}
              className={styles.card}
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
