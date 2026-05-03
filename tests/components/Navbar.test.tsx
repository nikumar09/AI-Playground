import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import type { User } from "firebase/auth"

vi.mock("@/context/AuthContext", () => ({
  useUser: vi.fn(),
}))

import { useUser } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"

const mockUseUser = vi.mocked(useUser)

function renderNavbar(user: User | null = null, loading = false) {
  mockUseUser.mockReturnValue({ user, loading })
  return render(<Navbar />)
}

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

  it("renders the Logout button", () => {
    renderNavbar()
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("shows user email when authenticated", () => {
    const fakeUser = { email: "heist@example.com" } as User
    renderNavbar(fakeUser)
    expect(screen.getByText("heist@example.com")).toBeInTheDocument()
  })

  it("does not show user email while loading", () => {
    const fakeUser = { email: "heist@example.com" } as User
    renderNavbar(fakeUser, true)
    expect(screen.queryByText("heist@example.com")).not.toBeInTheDocument()
  })

  it("does not show user email when logged out", () => {
    renderNavbar(null, false)
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
  })
})
