import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { User } from 'firebase/auth'

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
  Timestamp: { fromDate: vi.fn((d: Date) => ({ seconds: d.getTime() / 1000 })) },
}))

vi.mock('@/lib/firestore', () => ({ db: {}, heistsCollection: {} }))
vi.mock('@/lib/firebase', () => ({ app: {} }))
vi.mock('@/lib/auth', () => ({ auth: {} }))
vi.mock('@/types/firestore', () => ({
  COLLECTIONS: { USERS: 'users', HEISTS: 'heists' },
  heistConverter: {},
}))
vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

import { addDoc, getDocs } from 'firebase/firestore'
import { useUser } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import CreateHeistPage from '@/app/(dashboard)/heists/create/page'

const mockAddDoc = vi.mocked(addDoc)
const mockGetDocs = vi.mocked(getDocs)
const mockUseUser = vi.mocked(useUser)
const mockUseRouter = vi.mocked(useRouter)
const mockPush = vi.fn()

const fakeUser = {
  uid: 'creator-uid',
  email: 'creator@example.com',
  displayName: 'SwiftCrimsonFox',
} as User

const fakeUsers = {
  docs: [
    { data: () => ({ uid: 'agent-uid', codename: 'BoldJadeHawk' }) },
  ],
}

function setup() {
  mockUseUser.mockReturnValue({ user: fakeUser, loading: false })
  mockUseRouter.mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>)
  mockGetDocs.mockResolvedValue(fakeUsers as ReturnType<typeof getDocs> extends Promise<infer T> ? T : never)
  mockAddDoc.mockResolvedValue({} as ReturnType<typeof addDoc> extends Promise<infer T> ? T : never)
}

async function fillAndSubmit() {
  await waitFor(() => expect(screen.getByLabelText('Assign to')).not.toBeDisabled())
  fireEvent.change(screen.getByLabelText('Mission title'), { target: { value: 'Steal the coffee' } })
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Sneak into the break room.' } })
  fireEvent.submit(screen.getByRole('button', { name: /launch heist/i }).closest('form')!)
}

beforeEach(() => {
  vi.clearAllMocks()
  setup()
})

describe('CreateHeistPage', () => {
  it('renders title, description, and assignee fields', async () => {
    render(<CreateHeistPage />)
    expect(screen.getByLabelText('Mission title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Assign to')).toBeInTheDocument())
  })

  it('calls addDoc with correct shape on valid submission', async () => {
    render(<CreateHeistPage />)
    await fillAndSubmit()

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          title: 'Steal the coffee',
          description: 'Sneak into the break room.',
          createdBy: 'creator-uid',
          createdByCodename: 'SwiftCrimsonFox',
          assignedTo: 'agent-uid',
          finalStatus: null,
        })
      )
    })
  })

  it('sources createdBy and createdByCodename from useUser, not form inputs', async () => {
    render(<CreateHeistPage />)
    await fillAndSubmit()

    await waitFor(() => {
      const call = mockAddDoc.mock.calls[0][1] as Record<string, unknown>
      expect(call.createdBy).toBe('creator-uid')
      expect(call.createdByCodename).toBe('SwiftCrimsonFox')
    })
  })

  it('disables submit button while in-flight', async () => {
    mockAddDoc.mockReturnValue(new Promise(() => {}))
    render(<CreateHeistPage />)
    await fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /launching/i })).toBeDisabled()
    })
  })

  it('shows error message when addDoc rejects', async () => {
    mockAddDoc.mockRejectedValue(new Error('network error'))
    render(<CreateHeistPage />)
    await fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
    })
  })

  it('calls router.push with /heists on success', async () => {
    render(<CreateHeistPage />)
    await fillAndSubmit()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/heists')
    })
  })
})
