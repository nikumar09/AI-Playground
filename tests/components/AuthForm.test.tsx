import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AuthForm from "@/components/AuthForm"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  getAuth: vi.fn(() => ({})),
}))

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  setDoc: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({ auth: {} }))
vi.mock("@/lib/firebase", () => ({ app: {} }))
vi.mock("@/lib/firestore", () => ({ db: {} }))
vi.mock("@/lib/generateCodename", () => ({
  generateCodename: vi.fn(() => "SwiftCrimsonFox"),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

const mockPush = vi.fn()

function setupRouter() {
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  } as ReturnType<typeof useRouter>)
}

function setupSuccessfulSignup() {
  const fakeUser = { uid: "abc123" }
  vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
    user: fakeUser,
  } as Awaited<ReturnType<typeof createUserWithEmailAndPassword>>)
  vi.mocked(updateProfile).mockResolvedValue(undefined)
  vi.mocked(setDoc).mockResolvedValue(undefined)
}

function fillAndSubmit(buttonName: RegExp) {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "user@example.com" },
  })
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "securepassword" },
  })
  fireEvent.submit(
    screen.getByRole("button", { name: buttonName }).closest("form")!
  )
}

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupRouter()
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

  it("submitting valid signup credentials calls createUserWithEmailAndPassword", async () => {
    setupSuccessfulSignup()
    render(<AuthForm mode="signup" />)
    fillAndSubmit(/sign up/i)

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "user@example.com",
        "securepassword"
      )
    })
  })

  it("successful signup redirects to /heists", async () => {
    setupSuccessfulSignup()
    render(<AuthForm mode="signup" />)
    fillAndSubmit(/sign up/i)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("submit button is disabled while request is in-flight", async () => {
    let resolveSignup!: (value: Awaited<ReturnType<typeof createUserWithEmailAndPassword>>) => void
    vi.mocked(createUserWithEmailAndPassword).mockReturnValue(
      new Promise((resolve) => { resolveSignup = resolve })
    )
    vi.mocked(updateProfile).mockResolvedValue(undefined)
    vi.mocked(setDoc).mockResolvedValue(undefined)

    render(<AuthForm mode="signup" />)
    fillAndSubmit(/sign up/i)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /signing up/i })).toBeDisabled()
    })

    resolveSignup({ user: { uid: "abc123" } } as Awaited<ReturnType<typeof createUserWithEmailAndPassword>>)
  })

  it("shows friendly error for auth/email-already-in-use", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/email-already-in-use",
    })

    render(<AuthForm mode="signup" />)
    fillAndSubmit(/sign up/i)

    await waitFor(() => {
      expect(
        screen.getByText("An account with this email already exists.")
      ).toBeInTheDocument()
    })
  })

  it("shows generic error for unknown Firebase errors", async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
      code: "auth/network-request-failed",
    })

    render(<AuthForm mode="signup" />)
    fillAndSubmit(/sign up/i)

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument()
    })
  })

  it("submitting with empty fields does not call createUserWithEmailAndPassword", () => {
    render(<AuthForm mode="signup" />)
    fireEvent.submit(
      screen.getByRole("button", { name: /sign up/i }).closest("form")!
    )
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled()
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
