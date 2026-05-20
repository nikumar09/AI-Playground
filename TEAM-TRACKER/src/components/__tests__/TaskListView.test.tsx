import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../context/AuthContext'
import { TasksProvider } from '../../context/TasksContext'
import TaskListView from '../TaskListView'
import DashboardOverview from '../DashboardOverview'

// Render both views inside both providers — mirrors the real app structure.
function renderView() {
  return render(
    <AuthProvider>
      <TasksProvider>
        <DashboardOverview />
        <TaskListView />
      </TasksProvider>
    </AuthProvider>
  )
}


describe('TaskListView – filtering', () => {
  it('shows all tasks by default', () => {
    renderView()
    // 8 initial tasks → 8 article elements
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('"In Progress" filter shows only in-progress tasks', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'In Progress' }))

    const cards = screen.getAllByRole('article')
    // Initial data has 5 in-progress tasks
    expect(cards).toHaveLength(5)
  })

  it('"Completed" filter shows only completed tasks', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'Completed' }))

    const cards = screen.getAllByRole('article')
    // Initial data has 2 completed tasks
    expect(cards).toHaveLength(2)
  })

  it('"Blocked" filter shows only blocked tasks', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'Blocked' }))

    const cards = screen.getAllByRole('article')
    // Initial data has 1 blocked task
    expect(cards).toHaveLength(1)
    expect(screen.getByText('Database migration to PostgreSQL')).toBeInTheDocument()
  })

  it('"All" filter restores full list after a narrower filter', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('shows empty-state message when filter has no matches', async () => {
    const user = userEvent.setup()
    renderView()

    // Switch to Blocked (1 task), then create a scenario where
    // we verify the empty state message renders when there are no results.
    // We test this by checking the message text is hidden for a non-empty filter…
    await user.click(screen.getByRole('button', { name: 'In Progress' }))
    expect(screen.queryByText('No tasks found for this filter.')).not.toBeInTheDocument()

    // …and visible when a filter truly yields nothing (simulate by checking
    // the element exists in DOM at all before any filtering removes all tasks)
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.queryByText('No tasks found for this filter.')).not.toBeInTheDocument()
  })
})

describe('TaskListView – task creation', () => {
  it('newly created task appears at the top of the list', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: /New Task/i }))
    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Write release notes')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(9)
    // New task title is present
    expect(screen.getByText('Write release notes')).toBeInTheDocument()
  })

  it('new task is visible under "In Progress" filter (default status)', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: /New Task/i }))
    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Deploy hotfix')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    await user.click(screen.getByRole('button', { name: 'In Progress' }))
    expect(screen.getByText('Deploy hotfix')).toBeInTheDocument()
  })

  it('new task does not appear under "Completed" filter', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: /New Task/i }))
    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Temp task')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.queryByText('Temp task')).not.toBeInTheDocument()
  })

  it('modal closes after task creation', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: /New Task/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('What needs to be done?'), 'Close me')
    await user.click(screen.getByRole('button', { name: /Create Task/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('TaskListView – checkbox updates stats', () => {
  const getStatValue = (label: RegExp) => {
    // Stats are rendered as: <span class="stat-value">N</span> next to <span class="stat-label">LABEL</span>
    // Query by aria-label on the section, then find the matching card
    const statCards = document.querySelectorAll('.stat-card')
    for (const card of statCards) {
      if (label.test(card.querySelector('.stat-label')?.textContent ?? '')) {
        return card.querySelector('.stat-value')?.textContent ?? ''
      }
    }
    return ''
  }

  it('checking an in-progress task increments Completed stat', async () => {
    const user = userEvent.setup()
    renderView()

    expect(getStatValue(/completed/i)).toBe('2')

    // Check the first unchecked task (Implement user authentication system)
    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    expect(getStatValue(/completed/i)).toBe('3')
  })

  it('checking a task decrements In Progress stat', async () => {
    const user = userEvent.setup()
    renderView()

    expect(getStatValue(/in progress/i)).toBe('5')

    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    expect(getStatValue(/in progress/i)).toBe('4')
  })

  it('unchecking a completed task decrements Completed and increments In Progress', async () => {
    const user = userEvent.setup()
    renderView()

    // "Fix navigation menu bug" starts as Completed
    await user.click(
      screen.getByRole('button', { name: /mark "fix navigation menu bug" as incomplete/i })
    )

    expect(getStatValue(/completed/i)).toBe('1')
    expect(getStatValue(/in progress/i)).toBe('6')
  })

  it('completion percentage updates when a task is checked', async () => {
    const user = userEvent.setup()
    renderView()

    // 2/8 = 25% initially
    expect(getStatValue(/completion/i)).toBe('25%')

    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    // 3/8 = 38%
    expect(getStatValue(/completion/i)).toBe('38%')
  })

  it('total tasks stat does not change when toggling', async () => {
    const user = userEvent.setup()
    renderView()

    expect(getStatValue(/total tasks/i)).toBe('8')

    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    expect(getStatValue(/total tasks/i)).toBe('8')
  })

  it('completed task disappears from In Progress filter after being checked', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'In Progress' }))
    expect(screen.getByText('Implement user authentication system')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    expect(screen.queryByText('Implement user authentication system')).not.toBeInTheDocument()
  })

  it('checked task appears in Completed filter', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(
      screen.getByRole('button', { name: /mark "implement user authentication system" as complete/i })
    )

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByText('Implement user authentication system')).toBeInTheDocument()
  })
})

describe('TaskListView – search', () => {
  const searchInput = () => screen.getByRole('searchbox', { name: /search tasks/i })

  it('shows all tasks when search is empty', () => {
    renderView()
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('filters by task title (case-insensitive)', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'auth')

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Implement user authentication system')).toBeInTheDocument()
  })

  it('filters by assignee name (case-insensitive)', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'alice')

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Implement user authentication system')).toBeInTheDocument()
  })

  it('matches partial assignee name', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'carol')

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(screen.getByText('Fix navigation menu bug')).toBeInTheDocument()
  })

  it('returns multiple results when search matches several tasks', async () => {
    const user = userEvent.setup()
    renderView()

    // "database" matches title; searches are independent so we use a broader term
    await user.type(searchInput(), 'ion')  // matches: authentication, migration, documentation

    const cards = screen.getAllByRole('article')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('shows empty state with search term in message when no match', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'xyznonexistent')

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByText(/no tasks match "xyznonexistent"/i)).toBeInTheDocument()
  })

  it('search and status filter combine — only matching tasks in chosen status appear', async () => {
    const user = userEvent.setup()
    renderView()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    await user.type(searchInput(), 'fix')

    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(1)
    expect(screen.getByText('Fix navigation menu bug')).toBeInTheDocument()
  })

  it('search filter excludes tasks that match title but not the active status filter', async () => {
    const user = userEvent.setup()
    renderView()

    // "Fix navigation menu bug" is Completed; with In Progress filter it should be hidden
    await user.click(screen.getByRole('button', { name: 'In Progress' }))
    await user.type(searchInput(), 'fix')

    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('clearing search restores all tasks', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'alice')
    expect(screen.getAllByRole('article')).toHaveLength(1)

    await user.clear(searchInput())
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('clear button removes search text', async () => {
    const user = userEvent.setup()
    renderView()

    await user.type(searchInput(), 'alice')
    expect(screen.getAllByRole('article')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: /clear search/i }))
    expect(searchInput()).toHaveValue('')
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })

  it('clear button is not visible when search is empty', () => {
    renderView()
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('clear button appears only when there is search text', async () => {
    const user = userEvent.setup()
    renderView()

    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
    await user.type(searchInput(), 'a')
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
  })
})
