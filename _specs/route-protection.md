# Spec for route-protection
branch: claude/feature/route-protection
figma_component (if used): N/A

## Summary
Add auth-based route protection to both layout groups. Public pages (`(public)`) should only be accessible to unauthenticated users — authenticated users are redirected away. Dashboard pages (`(dashboard)`) should only be accessible to authenticated users — unauthenticated users are redirected away. Both group layouts should display a simple loading indicator while Firebase resolves the initial auth state, preventing a flash of the wrong content before the redirect fires.

## Functional Requirements
- `app/(public)/layout.tsx` uses `useUser` to read auth state. If `loading` is `true`, render a simple loader. If `user` is non-null (authenticated), redirect to `/heists`.
- `app/(dashboard)/layout.tsx` uses `useUser` to read auth state. If `loading` is `true`, render a simple loader. If `user` is `null` (unauthenticated), redirect to `/login`.
- Both layouts must become `'use client'` components to use the `useUser` hook.
- The loader is a minimal visual indicator (e.g. a centred spinner or loading text) — no specific design required, just enough to prevent a blank or flickering screen. 
- Redirects use Next.js `useRouter` (`router.replace`) so they do not add an entry to the browser history.
- Once auth state is resolved and the user passes the guard, children are rendered normally.

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- Firebase takes longer than expected to resolve — the loader persists until `loading` becomes `false`, so there is no premature redirect.
- User logs out while on a dashboard page — `useUser` updates reactively, triggering the redirect to `/login`.
- User logs in while on a public page — `useUser` updates reactively, triggering the redirect to `/heists`.
- The loader itself should not be styled in a way that causes layout shift when it is replaced by the page content.

## Acceptance Criteria
- Unauthenticated users visiting any `(dashboard)` route are redirected to `/login`.
- Authenticated users visiting any `(public)` route are redirected to `/heists`.
- Both layouts render a loader while `loading` is `true`.
- No page content is shown before the auth state resolves.
- Redirects use `router.replace` (no back-button history entry added).
- Logging out from a dashboard page redirects to `/login` automatically.
- Logging in from a public page redirects to `/heists` automatically.

## Open Questions
- None.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `(public)` layout renders the loader while `loading` is `true`.
- `(public)` layout renders children when `user` is `null` and `loading` is `false`.
- `(public)` layout redirects to `/heists` when `user` is non-null.
- `(dashboard)` layout renders the loader while `loading` is `true`.
- `(dashboard)` layout renders children when `user` is non-null and `loading` is `false`.
- `(dashboard)` layout redirects to `/login` when `user` is `null`.
