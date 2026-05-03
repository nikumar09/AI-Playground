import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// component imports
import Navbar from "@/components/Navbar"

describe("Navbar", () => {
  it("renders the main heading", () => {
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create New Heist link", () => {
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create new heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("renders the Logout button", () => {
    render(<Navbar />)

    const logoutBtn = screen.getByRole("button", { name: /logout/i })
    expect(logoutBtn).toBeInTheDocument()
  })
})
