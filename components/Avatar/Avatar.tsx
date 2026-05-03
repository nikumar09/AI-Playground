import styles from "./Avatar.module.css"

type AvatarSize = "sm" | "md" | "lg"

interface AvatarProps {
  src?: string
  alt: string
  size?: AvatarSize
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

export default function Avatar({ src, alt, size = "md" }: AvatarProps) {
  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      data-testid="avatar"
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials(alt)}</span>
      )}
    </div>
  )
}
