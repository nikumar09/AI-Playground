# Spec for use-heists-hook
branch: claude/feature/use-heists-hook
figma_component (if used): N/A

## Summary
Create a `useHeists` hook that subscribes to real-time Firestore data from the `heists` collection and returns a filtered array of `Heist` objects. The hook accepts a `mode` argument (`'active'`, `'assigned'`, or `'expired'`) and constructs the appropriate Firestore query. The hook is then used in `app/(dashboard)/heists/page.tsx` to render the title of each heist in all three result sets.

## Functional Requirements
- The hook is named `useHeists` and lives in `hooks/useHeists.ts`.
- It accepts a single argument: `mode: 'active' | 'assigned' | 'expired'`.
- It returns `{ heists: Heist[], loading: boolean }`.
- It uses Firestore's `onSnapshot` for real-time updates, unsubscribing on unmount.
- The current user's uid is obtained from `useUser()`.
- Query logic per mode:
  - **`'active'`** — heists where `assignedTo == currentUser.uid` AND `deadline > now`.
  - **`'assigned'`** — heists where `createdBy == currentUser.uid` AND `deadline > now`.
  - **`'expired'`** — heists where `deadline <= now` AND `finalStatus != null`.
- Results are converted to `Heist` objects via the existing `heistConverter` (already applied on `heistsCollection`).
- `loading` is `true` until the first snapshot fires.
- `app/(dashboard)/heists/page.tsx` calls `useHeists` three times (once per mode) and renders a list of heist titles under each section heading.

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- `user` is `null` (not yet authenticated) — the hook should not subscribe and should return `{ heists: [], loading: false }`.
- Firestore query returns no results — return an empty array with `loading: false`.
- The same hook instance receiving a changed `mode` prop — the subscription should be torn down and re-established with the new query.
- Multiple simultaneous `onSnapshot` listeners (one per mode) — each hook call manages its own independent subscription.

## Acceptance Criteria
- `useHeists('active')` returns only heists assigned to the current user with a future deadline.
- `useHeists('assigned')` returns only heists created by the current user with a future deadline.
- `useHeists('expired')` returns only heists with a past deadline and a non-null `finalStatus`.
- Each subscription updates in real-time when Firestore data changes.
- The hook cleans up its listener on unmount.
- `app/(dashboard)/heists/page.tsx` renders the title of each heist under the correct section.
- `loading` is `true` before the first snapshot and `false` after.

## Open Questions
- None.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `useHeists('active')` subscribes with the correct Firestore query (assignedTo + deadline filter).
- `useHeists('assigned')` subscribes with the correct Firestore query (createdBy + deadline filter).
- `useHeists('expired')` subscribes with the correct Firestore query (deadline + finalStatus filter).
- Returns `loading: true` before the snapshot fires, `false` after.
- Returns an empty array when the user is null.
- The heists page renders titles from all three modes.
