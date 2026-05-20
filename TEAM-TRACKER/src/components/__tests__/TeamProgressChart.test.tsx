import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../context/AuthContext'
import { TasksProvider } from '../../context/TasksContext'
import TeamProgressChart, { type MemberProgress } from '../TeamProgressChart'
import TaskListView from '../TaskListView'
import DashboardOverview from '../DashboardOverview'

function renderDashboard() {
  return render(
    <AuthProvider>
      <TasksProvider>
        <DashboardOverview />
        <TaskListView />
      </TasksProvider>
    </AuthProvider>
  )
}


const members: MemberProgress[] = [
  { name: 'Alice Johnson', total: 3, completed: 3, pct: 100 },
  { name: 'Bob Smith',     total: 4, completed: 2, pct: 50  },
  { name: 'Carol Davis',   total: 2, completed: 0, pct: 0   },
]

describe('TeamProgressChart – rendering', () => {
  it('renders a row for each member', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders each member name', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    expect(screen.getByText('Carol Davis')).toBeInTheDocument()
  })

  it('renders correct percentage for each member', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders correct fraction (completed/total) for each member', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getByText('3/3')).toBeInTheDocument()
    expect(screen.getByText('2/4')).toBeInTheDocument()
    expect(screen.getByText('0/2')).toBeInTheDocument()
  })

  it('renders correct initials in avatar', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getByText('AJ')).toBeInTheDocument()
    expect(screen.getByText('BS')).toBeInTheDocument()
    expect(screen.getByText('CD')).toBeInTheDocument()
  })

  it('shows member count and task total in header', () => {
    render(<TeamProgressChart members={members} />)
    // "3 members · 9 tasks" (3+4+2=9)
    expect(screen.getByText(/3 members/i)).toBeInTheDocument()
    expect(screen.getByText(/9 tasks/i)).toBeInTheDocument()
  })

  it('uses singular "member" when only one member', () => {
    render(<TeamProgressChart members={[members[0]]} />)
    expect(screen.getByText(/1 member\b/i)).toBeInTheDocument()
  })

  it('renders nothing when members array is empty', () => {
    const { container } = render(<TeamProgressChart members={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('each row has an accessible aria-label describing progress', () => {
    render(<TeamProgressChart members={members} />)
    expect(screen.getByRole('listitem', {
      name: /alice johnson: 3 of 3 tasks completed \(100%\)/i
    })).toBeInTheDocument()
    expect(screen.getByRole('listitem', {
      name: /carol davis: 0 of 2 tasks completed \(0%\)/i
    })).toBeInTheDocument()
  })
})

describe('TeamProgressChart – bar widths', () => {
  it('sets bar fill width matching the member percentage', () => {
    const { container } = render(<TeamProgressChart members={members} />)
    const fills = container.querySelectorAll('.tp-bar-fill')

    expect((fills[0] as HTMLElement).style.width).toBe('100%')
    expect((fills[1] as HTMLElement).style.width).toBe('50%')
    expect((fills[2] as HTMLElement).style.width).toBe('0%')
  })
})

describe('TeamProgressChart – integration with TaskListView', () => {
  it('chart is present on the dashboard', () => {
    renderDashboard()
    expect(screen.getByText('Team Progress')).toBeInTheDocument()
  })

  it('shows all 8 initial task assignees', () => {
    renderDashboard()
    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(8)
  })

  it('chart updates when a task is checked off', async () => {
    const user = userEvent.setup()
    renderDashboard()

    // Alice Johnson starts with 0% (1 task, In Progress)
    expect(screen.getByRole('listitem', {
      name: /alice johnson: 0 of 1 tasks completed \(0%\)/i
    })).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /mark "implement user authentication system" as complete/i
      })
    )

    // After toggle: Alice Johnson has 1/1 = 100%
    expect(screen.getByRole('listitem', {
      name: /alice johnson: 1 of 1 tasks completed \(100%\)/i
    })).toBeInTheDocument()
  })

  it('chart updates when a task is unchecked', async () => {
    const user = userEvent.setup()
    renderDashboard()

    // Carol Davis starts at 100% (1 task, Completed)
    expect(screen.getByRole('listitem', {
      name: /carol davis: 1 of 1 tasks completed \(100%\)/i
    })).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /mark "fix navigation menu bug" as incomplete/i
      })
    )

    expect(screen.getByRole('listitem', {
      name: /carol davis: 0 of 1 tasks completed \(0%\)/i
    })).toBeInTheDocument()
  })

  it('new task assignee appears in chart', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await user.click(screen.getByRole('button', { name: /New Task/i }))
    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'New work item')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    // Alex Rivera is the default assignee — verify a chart row exists for them
    expect(screen.getByRole('listitem', {
      name: /alex rivera: \d+ of \d+ tasks completed/i
    })).toBeInTheDocument()
  })
})
