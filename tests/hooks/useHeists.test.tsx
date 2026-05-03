import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { User } from 'firebase/auth'

const mockNow = { seconds: 1000000 }

vi.mock('firebase/firestore', () => ({
  query: vi.fn((...args) => ({ _query: args })),
  where: vi.fn((field, op, val) => ({ field, op, val })),
  onSnapshot: vi.fn(),
  Timestamp: { now: vi.fn(() => mockNow) },
}))

vi.mock('@/lib/firestore', () => ({ heistsCollection: { _id: 'heists' } }))
vi.mock('@/lib/firebase', () => ({ app: {} }))
vi.mock('@/lib/auth', () => ({ auth: {} }))
vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))

import { query, where, onSnapshot } from 'firebase/firestore'
import { useUser } from '@/context/AuthContext'
import { useHeists } from '@/hooks/useHeists'

const mockOnSnapshot = vi.mocked(onSnapshot)
const mockWhere = vi.mocked(where)
const mockUseUser = vi.mocked(useUser)

const fakeUser = { uid: 'user-123', email: 'agent@example.com' } as User

function setupUser(user: User | null = fakeUser) {
  mockUseUser.mockReturnValue({ user, loading: false })
}

function fireSnapshot(docs: { data: () => object }[] = []) {
  const callback = mockOnSnapshot.mock.calls[mockOnSnapshot.mock.calls.length - 1][1] as (s: unknown) => void
  act(() => callback({ docs: docs.map((d) => ({ data: d.data, id: 'id-' + Math.random() })) }))
}

beforeEach(() => {
  vi.clearAllMocks()
  mockOnSnapshot.mockReturnValue(vi.fn())
})

describe('useHeists', () => {
  it("'active' mode queries with assignedTo == uid and deadline > now", () => {
    setupUser()
    renderHook(() => useHeists('active'))

    expect(mockWhere).toHaveBeenCalledWith('assignedTo', '==', 'user-123')
    expect(mockWhere).toHaveBeenCalledWith('deadline', '>', mockNow)
  })

  it("'assigned' mode queries with createdBy == uid and deadline > now", () => {
    setupUser()
    renderHook(() => useHeists('assigned'))

    expect(mockWhere).toHaveBeenCalledWith('createdBy', '==', 'user-123')
    expect(mockWhere).toHaveBeenCalledWith('deadline', '>', mockNow)
  })

  it("'expired' mode queries with deadline <= now and finalStatus != null", () => {
    setupUser()
    renderHook(() => useHeists('expired'))

    expect(mockWhere).toHaveBeenCalledWith('deadline', '<=', mockNow)
    expect(mockWhere).toHaveBeenCalledWith('finalStatus', '!=', null)
  })

  it('is loading before snapshot fires and false after', () => {
    setupUser()
    const { result } = renderHook(() => useHeists('active'))

    expect(result.current.loading).toBe(true)
    fireSnapshot()
    expect(result.current.loading).toBe(false)
  })

  it('returns empty array and loading false when user is null', () => {
    setupUser(null)
    const { result } = renderHook(() => useHeists('active'))

    expect(result.current.heists).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it('maps snapshot docs to heist objects', () => {
    setupUser()
    const { result } = renderHook(() => useHeists('active'))

    fireSnapshot([
      { data: () => ({ id: 'h1', title: 'Steal the coffee' }) },
      { data: () => ({ id: 'h2', title: 'Swap the keyboards' }) },
    ])

    expect(result.current.heists).toHaveLength(2)
    expect(result.current.heists[0].title).toBe('Steal the coffee')
  })
})
