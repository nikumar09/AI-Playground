import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import TaskCard from '../TaskCard'

const baseProps = {
  title: 'Write unit tests',
  priority: 'high' as const,
  assignee: { name: 'Alice Johnson' },
  dueDate: '3 days left',
}

// Controlled wrapper that mirrors how TaskListView drives TaskCard
function ControlledCard(props: typeof baseProps & { initialCompleted?: boolean }) {
  const { initialCompleted = false, ...rest } = props
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  return <TaskCard {...rest} isCompleted={isCompleted} onToggle={() => setIsCompleted(c => !c)} />
}

describe('TaskCard – rendering', () => {
  it('renders title, priority, assignee and due date', () => {
    render(<TaskCard {...baseProps} />)
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('3 days left')).toBeInTheDocument()
  })

  it('renders medium priority label', () => {
    render(<TaskCard {...baseProps} priority="medium" />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('renders low priority label', () => {
    render(<TaskCard {...baseProps} priority="low" />)
    expect(screen.getByText('LOW')).toBeInTheDocument()
  })

  it('shows assignee initials when no avatar is provided', () => {
    render(<TaskCard {...baseProps} assignee={{ name: 'Alice Johnson' }} />)
    expect(screen.getByText('AJ')).toBeInTheDocument()
  })

  it('uses provided initials override', () => {
    render(<TaskCard {...baseProps} assignee={{ name: 'Alice Johnson', initials: 'XX' }} />)
    expect(screen.getByText('XX')).toBeInTheDocument()
  })

  it('renders optional description when provided', () => {
    render(<TaskCard {...baseProps} description="This is a description" />)
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('does not render description element when omitted', () => {
    render(<TaskCard {...baseProps} />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })
})

describe('TaskCard – completion state from props', () => {
  it('starts unchecked when isCompleted is false', () => {
    render(<TaskCard {...baseProps} isCompleted={false} />)
    expect(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))
      .toHaveAttribute('aria-pressed', 'false')
  })

  it('starts checked when isCompleted is true', () => {
    render(<TaskCard {...baseProps} isCompleted={true} />)
    expect(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('applies completed class to title when isCompleted is true', () => {
    render(<TaskCard {...baseProps} isCompleted={true} />)
    expect(screen.getByRole('heading', { name: 'Write unit tests' })).toHaveClass('completed')
  })

  it('does not apply completed class when isCompleted is false', () => {
    render(<TaskCard {...baseProps} isCompleted={false} />)
    expect(screen.getByRole('heading', { name: 'Write unit tests' })).not.toHaveClass('completed')
  })
})

describe('TaskCard – onToggle callback', () => {
  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TaskCard {...baseProps} isCompleted={false} onToggle={onToggle} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('calls onToggle when checkbox is clicked while completed', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TaskCard {...baseProps} isCompleted={true} onToggle={onToggle} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('does not throw when onToggle is not provided', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...baseProps} isCompleted={false} />)

    await expect(
      user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))
    ).resolves.not.toThrow()
  })
})

describe('TaskCard – controlled toggle (via wrapper)', () => {
  it('checkbox reflects completed state after toggle', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))

    expect(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles back to incomplete on second click', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))
    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))

    expect(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))
      .toHaveAttribute('aria-pressed', 'false')
  })

  it('adds completed class to title after toggling to complete', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))

    expect(screen.getByRole('heading', { name: 'Write unit tests' })).toHaveClass('completed')
  })

  it('removes completed class after toggling back to incomplete', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} initialCompleted={true} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))

    expect(screen.getByRole('heading', { name: 'Write unit tests' })).not.toHaveClass('completed')
  })

  it('toggles via Enter key', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    const checkbox = screen.getByRole('button', { name: /mark "write unit tests" as complete/i })
    checkbox.focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles via Space key', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    const checkbox = screen.getByRole('button', { name: /mark "write unit tests" as complete/i })
    checkbox.focus()
    await user.keyboard(' ')

    expect(screen.getByRole('button', { name: /mark "write unit tests" as incomplete/i }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('multiple rapid toggles end in correct state', async () => {
    const user = userEvent.setup()
    render(<ControlledCard {...baseProps} />)

    const getCheckbox = () =>
      screen.getByRole('button', { name: /mark "write unit tests" as (complete|incomplete)/i })

    await user.click(getCheckbox()) // → complete
    await user.click(getCheckbox()) // → incomplete
    await user.click(getCheckbox()) // → complete

    expect(getCheckbox()).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('TaskCard – stats integration (via TaskListView)', () => {
  it('checking a task updates stats', async () => {
    // This is tested more thoroughly in TaskListView.test.tsx
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TaskCard {...baseProps} isCompleted={false} onToggle={onToggle} />)

    await user.click(screen.getByRole('button', { name: /mark "write unit tests" as complete/i }))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})
