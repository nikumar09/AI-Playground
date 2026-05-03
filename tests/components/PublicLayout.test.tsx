import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { User } from "firebase/auth"

vi.mock("@/context/AuthContext", () => ({ useUser: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }))

import { useUser } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import PublicLayout from "@/app/(public)/layout"

const mockUseUser = vi.mocked(useUser)
const mockUseRouter = vi.mocked(useRouter)
const mockReplace = vi.fn()

function renderLayout(user: User | null, loading: boolean) {
  mockUseUser.mockReturnValue({ user, loading })
  mockUseRouter.mockReturnValue({ replace: mockReplace } as ReturnType<typeof useRouter>)
  return render(<PublicLayout>page content</PublicLayout>)
}

beforeEach(() => vi.clearAllMocks())

describe("PublicLayout", () => {
  it("renders the spinner while loading", () => {
    renderLayout(null, true)
    expect(screen.queryByText("page content")).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("renders children when unauthenticated and not loading", () => {
    renderLayout(null, false)
    expect(screen.getByText("page content")).toBeInTheDocument()
  })

  it("renders the spinner instead of children when user is authenticated", () => {
    renderLayout({ email: "user@example.com" } as User, false)
    expect(screen.queryByText("page content")).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("redirects to /heists when user is authenticated", async () => {
    renderLayout({ email: "user@example.com" } as User, false)
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/heists")
    })
  })

  it("does not redirect while loading", () => {
    renderLayout(null, true)
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
