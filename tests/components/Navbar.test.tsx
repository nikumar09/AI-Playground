import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { User } from "firebase/auth"

vi.mock("@/context/AuthContext", () => ({
  useUser: vi.fn(),
}))

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({ auth: {} }))

import { useUser } from "@/context/AuthContext"
import { signOut } from "firebase/auth"
import Navbar from "@/components/Navbar"

const mockUseUser = vi.mocked(useUser)
const mockSignOut = vi.mocked(signOut)

const fakeUser = { email: "heist@example.com" } as User

function renderNavbar(user: User | null = null, loading = false) {
  mockUseUser.mockReturnValue({ user, loading })
  return render(<Navbar />)
}

beforeEach(() => {
  vi.clearAllMocks()
  mockSignOut.mockResolvedValue(undefined)
})

describe("Navbar", () => {
  it("renders the main heading", () => {
    renderNavbar()
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  })

  it("renders the Create New Heist link", () => {
    renderNavbar()
    const createLink = screen.getByRole("link", { name: /create new heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("shows user email when authenticated", () => {
    renderNavbar(fakeUser)
    expect(screen.getByText("heist@example.com")).toBeInTheDocument()
  })

  it("does not show user email while loading", () => {
    renderNavbar(fakeUser, true)
    expect(screen.queryByText("heist@example.com")).not.toBeInTheDocument()
  })

  it("does not show user email when logged out", () => {
    renderNavbar(null, false)
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
  })

  it("renders the Logout button when user is authenticated", () => {
    renderNavbar(fakeUser)
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("does not render the Logout button when user is null", () => {
    renderNavbar(null)
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  it("clicking Logout calls signOut", async () => {
    renderNavbar(fakeUser)
    fireEvent.click(screen.getByRole("button", { name: /logout/i }))
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({})
    })
  })

  it("button is disabled while sign-out is pending", async () => {
    mockSignOut.mockReturnValue(new Promise(() => {}))
    renderNavbar(fakeUser)
    fireEvent.click(screen.getByRole("button", { name: /logout/i }))
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /logout/i })).toBeDisabled()
    })
  })

  it("button re-enables after signOut rejects", async () => {
    mockSignOut.mockRejectedValue(new Error("network error"))
    renderNavbar(fakeUser)
    fireEvent.click(screen.getByRole("button", { name: /logout/i }))
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /logout/i })).not.toBeDisabled()
    })
  })
})
