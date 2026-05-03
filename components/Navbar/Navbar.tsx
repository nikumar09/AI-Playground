'use client'

import { Clock8 } from "lucide-react"
import Link from "next/link"
import styles from "./Navbar.module.css"
import { useUser } from "@/context/AuthContext"

export default function Navbar() {
  const { user, loading } = useUser()

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul className={styles.navActions}>
          {!loading && user && (
            <li className={styles.userEmail}>{user.email}</li>
          )}
          <li>
            <button className={styles.btnOutline}>Logout</button>
          </li>
          <li>
            <Link href="/heists/create" className={styles.btnPrimary}>
              + Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
