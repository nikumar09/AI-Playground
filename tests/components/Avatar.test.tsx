import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders an image when src is provided", () => {
    render(<Avatar src="/avatar.png" alt="Jane Doe" />)
    const img = screen.getByRole("img", { name: /jane doe/i })
    expect(img).toBeInTheDocument()
  })

  it("renders initials fallback when no src is provided", () => {
    render(<Avatar alt="Jane Doe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders with size prop", () => {
    render(<Avatar alt="Agent X" size="lg" />)
    const avatar = screen.getByTestId("avatar")
    expect(avatar).toBeInTheDocument()
  })
})
