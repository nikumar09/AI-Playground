import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../context/AuthContext'
import NewTaskModal from '../NewTaskModal'

const onClose = vi.fn()
const onCreate = vi.fn()

function renderModal(isOpen = true) {
  render(
    <AuthProvider>
      <NewTaskModal isOpen={isOpen} onClose={onClose} onCreate={onCreate} />
    </AuthProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('NewTaskModal – rendering', () => {
  it('renders nothing when isOpen is false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the form when isOpen is true', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument()
  })

  it('auto-focuses the title input on open', () => {
    renderModal()
    expect(screen.getByPlaceholderText('What needs to be done?')).toHaveFocus()
  })

  it('defaults priority to Medium', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /Medium/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Low/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /High/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('defaults assignee to Alex Rivera', () => {
    renderModal()
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
  })
})

describe('NewTaskModal – validation', () => {
  it('does not call onCreate when title is empty', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('does not call onCreate when title is only whitespace', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), '   ')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).not.toHaveBeenCalled()
  })
})

describe('NewTaskModal – task creation', () => {
  it('calls onCreate with correct title', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Fix login bug')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledOnce()
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Fix login bug' }))
  })

  it('calls onCreate with selected priority', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Urgent task')
    await user.click(screen.getByRole('button', { name: /High/i }))
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }))
  })

  it('calls onCreate with low priority when Low is selected', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Low priority task')
    await user.click(screen.getByRole('button', { name: /Low/i }))
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ priority: 'low' }))
  })

  it('calls onCreate with status "In Progress"', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'New task')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ status: 'In Progress' }))
  })

  it('uses "No date set" fallback when due date is empty', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'No date task')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ dueDate: 'No date set' }))
  })

  it('passes the selected due date when provided', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Dated task')
    await user.type(screen.getByLabelText('Due Date'), '2025-12-31')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ dueDate: '2025-12-31' }))
  })

  it('calls onClose after successful creation', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Done task')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('NewTaskModal – dismissal', () => {
  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.click(screen.getByRole('button', { name: /Cancel/i }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed (modal level)', async () => {
    const user = userEvent.setup()
    renderModal()

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking the overlay', async () => {
    const user = userEvent.setup()
    renderModal()

    // The overlay is the modal-overlay div; click outside the inner container
    const overlay = document.querySelector('.modal-overlay') as HTMLElement
    await user.click(overlay)

    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('NewTaskModal – assignee dropdown', () => {
  // The trigger button's accessible name comes from aria-labelledby="assignee-label"
  // which points to the "Assignee" label, not the selected member's name.
  const openDropdown = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('button', { name: 'Assignee' }))
  }

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup()
    renderModal()

    await openDropdown(user)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('shows Alex Rivera as default selected assignee', () => {
    renderModal()
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
  })

  it('lists all 5 team members in the dropdown', async () => {
    const user = userEvent.setup()
    renderModal()

    await openDropdown(user)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(5)
  })

  it('selects a different assignee and passes it to onCreate', async () => {
    const user = userEvent.setup()
    renderModal()

    await openDropdown(user)
    await user.click(screen.getByRole('option', { name: /Sarah Chen/i }))

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Sarah task')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ assignee: expect.objectContaining({ name: 'Sarah Chen' }) })
    )
  })

  it('closes dropdown on Escape and keeps previous selection', async () => {
    const user = userEvent.setup()
    renderModal()

    await openDropdown(user)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    // Default assignee is still shown
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
  })
})
