import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { User } from "firebase/auth"

// Must be hoisted before imports that use firebase/auth
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
}))

vi.mock("@/lib/firebase", () => ({
  app: {},
}))

import { onAuthStateChanged } from "firebase/auth"
import { AuthProvider, useUser } from "@/context/AuthContext"

const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged)

function TestConsumer() {
  const { user, loading } = useUser()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="email">{user?.email ?? "null"}</span>
    </div>
  )
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

beforeEach(() => {
  mockOnAuthStateChanged.mockReset()
})

describe("AuthProvider / useUser", () => {
  it("is loading before onAuthStateChanged fires", () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {})

    renderWithAuth()

    expect(screen.getByTestId("loading").textContent).toBe("true")
  })

  it("returns { user: null, loading: false } when auth resolves unauthenticated", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null)
      return () => {}
    })

    renderWithAuth()

    expect(screen.getByTestId("loading").textContent).toBe("false")
    expect(screen.getByTestId("email").textContent).toBe("null")
  })

  it("returns { user, loading: false } when auth resolves authenticated", async () => {
    const fakeUser = { email: "test@example.com" } as User
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(fakeUser)
      return () => {}
    })

    renderWithAuth()

    expect(screen.getByTestId("loading").textContent).toBe("false")
    expect(screen.getByTestId("email").textContent).toBe("test@example.com")
  })

  it("transitions loading from true to false after callback fires", async () => {
    let fireCallback: (user: User | null) => void = () => {}
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      fireCallback = callback
      return () => {}
    })

    renderWithAuth()
    expect(screen.getByTestId("loading").textContent).toBe("true")

    await act(async () => {
      fireCallback(null)
    })

    expect(screen.getByTestId("loading").textContent).toBe("false")
  })

  it("throws when useUser is called outside AuthProvider", () => {
    function BadConsumer() {
      useUser()
      return null
    }

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<BadConsumer />)).toThrow(
      "useUser must be used within an AuthProvider"
    )
    consoleError.mockRestore()
  })
})
