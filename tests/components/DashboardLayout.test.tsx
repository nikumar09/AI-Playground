import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { User } from "firebase/auth"

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }))
vi.mock("@/components/Navbar", () => ({ default: () => <nav>Navbar</nav> }))
vi.mock("firebase/auth", () => ({ signOut: vi.fn() }))
vi.mock("@/lib/auth", () => ({ auth: {} }))

import { useUser } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/app/(dashboard)/layout"

const mockUseUser = vi.mocked(useUser)
const mockUseRouter = vi.mocked(useRouter)
const mockReplace = vi.fn()

function renderLayout(user: User | null, loading: boolean) {
  mockUseUser.mockReturnValue({ user, loading })
  mockUseRouter.mockReturnValue({ replace: mockReplace } as ReturnType<typeof useRouter>)
  return render(<DashboardLayout>page content</DashboardLayout>)
}

beforeEach(() => vi.clearAllMocks())

describe("DashboardLayout", () => {
  it("renders the spinner while loading", () => {
    renderLayout(null, true)
    expect(screen.queryByText("page content")).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("renders children and Navbar when authenticated and not loading", () => {
    renderLayout({ email: "user@example.com" } as User, false)
    expect(screen.getByText("page content")).toBeInTheDocument()
    expect(screen.getByText("Navbar")).toBeInTheDocument()
  })

  it("renders the spinner instead of children when unauthenticated", () => {
    renderLayout(null, false)
    expect(screen.queryByText("page content")).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("redirects to /login when unauthenticated", async () => {
    renderLayout(null, false)
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login")
    })
  })

  it("does not redirect while loading", () => {
    renderLayout(null, true)
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
