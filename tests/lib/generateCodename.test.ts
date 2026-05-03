import { describe, it, expect } from "vitest"
import { generateCodename } from "@/lib/generateCodename"

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy()
  })

  it("returns a PascalCase string made of three capitalised segments", () => {
    const result = generateCodename()
    expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/)
  })

  it("produces different values across multiple calls", () => {
    const results = new Set(Array.from({ length: 5 }, () => generateCodename()))
    expect(results.size).toBeGreaterThan(1)
  })
})
