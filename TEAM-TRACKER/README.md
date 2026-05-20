# Team Tracker

A team productivity dashboard built with React 19, TypeScript, and Vite. Manage tasks, track team performance, and view analytics — all in a single-page application with no backend dependency.

---

## Features

### Dashboard
Real-time overview of your team's current state:
- **5 stat cards** — Total tasks, Completed, In Progress, Completion %, Hours tracked
- **Team Progress chart** — Per-member progress bars, live-updated when tasks are checked off

### Tasks
Full task management with:
- **Task cards** — Priority badge (High / Medium / Low), assignee, due date, completion checkbox
- **Status filters** — All, In Progress, Completed, Blocked
- **Real-time search** — Filter by task title or assignee name with a clear button
- **New Task modal** — Title, assignee dropdown (active team members), priority selector, due date

### Analytics
30-day team performance report:
- **Productivity trend** — Smooth SVG area+line chart with 7-day moving average
- **Top Performers** — Ranked table with completion rates, hours, and trend indicators
- **Bottlenecks panel** — Blocked tasks, at-risk items, average task age, completion rate

### Settings
- **My Profile** — Change display name, upload a profile photo; email is read-only (account identifier)
- **User Management** (Admin only) — Toggle any team member active / inactive with a live switch. Inactive users cannot sign in; their task history is preserved.

### Authentication
- Email-only sign-in (no password required — demo app)
- New user sign-up (first name, last name, email)
- Session persisted in `localStorage`
- Two roles: **Admin** and **Member**
- Top-right header shows the signed-in user's name and avatar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Plain CSS with custom properties (no UI library) |
| Charts | Raw SVG (no charting library) |
| State | React Context (`AuthContext`, `TasksContext`) |
| Persistence | `localStorage` |
| Unit tests | Vitest 4 + React Testing Library |
| E2E tests | Playwright 1.60 (Chromium) |
| Linting | ESLint 10 + typescript-eslint |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Install

```bash
cd TEAM-TRACKER
npm install
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Sign in

Use any of the pre-seeded demo accounts (email only, no password):

| Email | Role |
|---|---|
| alex@teamtracker.dev | Admin |
| sarah@teamtracker.dev | Member |
| jordan@teamtracker.dev | Member |
| maria@teamtracker.dev | Member |
| liam@teamtracker.dev | Member |

Or click **Sign up** to create a new account.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `localhost:5173` |
| `npm run build` | Type-check then build for production (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests (starts dev server automatically) |
| `npm run test:e2e:ui` | Open Playwright UI for interactive E2E debugging |

---

## Project Structure

```
TEAM-TRACKER/
├── e2e/                        # Playwright end-to-end tests
│   └── tasks.spec.ts           # 39 E2E tests covering all user flows
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                 # Logos and avatar images
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.tsx    # Sign in / Sign up page
│   │   ├── settings/
│   │   │   └── SettingsView.tsx # Profile editor + admin user management
│   │   ├── __tests__/          # Vitest + RTL unit tests (88 tests)
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── Avatar.tsx          # Reusable avatar (photo or initials fallback)
│   │   ├── BottleneckPanel.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── Header.tsx
│   │   ├── NewTaskModal.tsx
│   │   ├── ProductivityChart.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskListView.tsx
│   │   ├── TeamMember.tsx
│   │   ├── TeamProgressChart.tsx
│   │   ├── TopPerformers.tsx
│   │   └── VelocityChart.tsx
│   ├── context/
│   │   ├── AuthContext.tsx     # Auth state, sign in/out/up, profile update
│   │   └── TasksContext.tsx    # Tasks state, stats, team progress (shared)
│   ├── data/
│   │   ├── analyticsData.ts   # Mock 30-day analytics dataset
│   │   └── tasksData.ts       # Task types and initial task data
│   ├── styles/
│   │   ├── Analytics.css
│   │   ├── App.css
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── NewTaskModal.css
│   │   ├── Settings.css
│   │   └── TaskCard.css
│   ├── test/
│   │   └── setup.ts           # jest-dom matchers setup
│   ├── types/
│   │   └── auth.ts            # AppUser type, seed users, helper functions
│   ├── App.tsx
│   └── main.tsx
├── playwright.config.ts
├── vite.config.ts
└── package.json
```

---

## Testing

### Unit Tests (Vitest + React Testing Library)

88 tests across 4 files covering:

- **TaskCard** — rendering, completion state from props, `onToggle` callback
- **NewTaskModal** — rendering, validation, task creation, dismissal, assignee dropdown
- **TaskListView** — filtering, task creation, checkbox → stats sync, search
- **TeamProgressChart** — rendering, bar widths, integration with live task state

```bash
npm test
```

### End-to-End Tests (Playwright)

39 tests in Chromium covering the full user flow:

- **Adding a task** — modal open/close, defaults, validation, priority, assignee, stats update
- **Filtering tasks** — All / In Progress / Completed / Blocked, active styles, empty state
- **Marking a task complete** — checkbox, strikethrough, aria-pressed, stat cards, team progress chart
- **Searching tasks** — title match, assignee match, case-insensitive, combined filter+search, clear button
- **Complete user flow** — add → search → filter → complete → verify stats end-to-end

```bash
# Requires the dev server to be running, or Playwright will start it automatically
npm run test:e2e
```

---

## Notes

- **No backend** — all data lives in `localStorage` and resets if cleared. This is intentional for a demo/training context.
- **No password** — sign-in uses email only. Production use would require a real authentication service.
- **Analytics data** — the 30-day trend and top-performer data are mock datasets (`src/data/analyticsData.ts`). They do not reflect the task data created in the Tasks view.
- **Inactive users** — marking a user inactive in Settings prevents sign-in but preserves all task history referencing that user.
