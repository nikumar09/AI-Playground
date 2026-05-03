import Link from "next/link"
import { Clock8, Target, Users, Zap } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.splash}>
      <div className={styles.glow} />
      <div className={styles.glowSecondary} />
      <div className={styles.grid} />

      <div className={styles.container}>
        <div className={styles.badge}>⚡ Office mischief platform</div>

        <h1 className={styles.headline}>
          P<Clock8 className={styles.clock} size={80} strokeWidth={2.25} />cket Heist
        </h1>

        <p className={styles.tagline}>
          Tiny missions.<br />
          <span className={styles.highlight}>Big office mischief.</span>
        </p>

        <p className={styles.sub}>
          Cook up devious little missions, rope in unsuspecting coworkers,
          <br className={styles.br} />
          and watch the mayhem unfold — one heist at a time.
        </p>

        <div className={styles.cta}>
          <Link href="/signup" className={styles.ctaBtn}>
            Start your first heist →
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Already an agent? Log in
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Target size={14} />
            <span>Create missions</span>
          </div>
          <div className={styles.feature}>
            <Users size={14} />
            <span>Assign co-conspirators</span>
          </div>
          <div className={styles.feature}>
            <Zap size={14} />
            <span>Track the chaos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
