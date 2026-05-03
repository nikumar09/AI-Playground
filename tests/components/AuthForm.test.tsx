import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AuthForm from "@/components/AuthForm"

describe("AuthForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("login mode renders email, password, and Login button", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument()
  })

  it("signup mode renders email, password, and Sign Up button", () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
  })

  it("password field defaults to type=password", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("clicking the toggle switches password to type=text and back", () => {
    render(<AuthForm mode="login" />)
    const toggle = screen.getByRole("button", { name: /show password/i })
    const passwordInput = screen.getByLabelText("Password")

    fireEvent.click(toggle)
    expect(passwordInput).toHaveAttribute("type", "text")

    fireEvent.click(toggle)
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("submitting with valid values calls console.log with email and password", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    render(<AuthForm mode="login" />)

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "user@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "securepassword" } })
    fireEvent.submit(screen.getByRole("button", { name: /^login$/i }).closest("form")!)

    expect(spy).toHaveBeenCalledWith({ email: "user@example.com", password: "securepassword" })
  })

  it("submitting with empty fields does not call console.log", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    render(<AuthForm mode="login" />)

    fireEvent.submit(screen.getByRole("button", { name: /^login$/i }).closest("form")!)

    expect(spy).not.toHaveBeenCalled()
  })

  it("login mode renders a link to /signup", () => {
    render(<AuthForm mode="login" />)
    const link = screen.getByRole("link", { name: /sign up/i })
    expect(link).toHaveAttribute("href", "/signup")
  })

  it("signup mode renders a link to /login", () => {
    render(<AuthForm mode="signup" />)
    const link = screen.getByRole("link", { name: /log in/i })
    expect(link).toHaveAttribute("href", "/login")
  })
})
