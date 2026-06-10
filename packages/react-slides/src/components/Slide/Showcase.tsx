import styles from "./Showcase.module.css"

interface ShowcaseProps {
  src: string
  alt?: string
  /** Optional smaller title shown at the bottom over a gradient scrim. */
  title?: string
  /** Optional description shown beneath the title. */
  description?: string
  /** How the image fills the slide. Defaults to "cover" (full-bleed, may crop). */
  fit?: "cover" | "contain"
}

export function Showcase({ src, alt = "", title, description, fit = "cover" }: ShowcaseProps) {
  return (
    <div className={styles.root}>
      <img className={styles.image} src={src} alt={alt} style={{ objectFit: fit }} />
      {(title || description) && (
        <div className={styles.caption}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
    </div>
  )
}
