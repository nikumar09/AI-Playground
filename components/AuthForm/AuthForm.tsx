"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import styles from "./AuthForm.module.css"

interface AuthFormProps {
  mode: "login" | "signup"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const isLogin = mode === "login"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.")
      valid = false
    } else {
      setEmailError("")
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.")
      valid = false
    } else {
      setPasswordError("")
    }

    if (valid) {
      console.log({ email, password })
    }
  }

  return (
    <div className="center-content">
      <div className={`page-content ${styles.card}`}>
        <h2 className="form-title">
          {isLogin ? "Log in to Your Account" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
            {emailError && <span className={styles.error}>{emailError}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.passwordGroup}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && <span className={styles.error}>{passwordError}</span>}
          </div>

          <button type="submit" className="btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className={styles.switchText}>
            {isLogin ? (
              <>Don&apos;t have an account?{" "}
                <a href="/signup" className={styles.switchLink}>Sign up</a>
              </>
            ) : (
              <>Already have an account?{" "}
                <a href="/login" className={styles.switchLink}>Log in</a>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
