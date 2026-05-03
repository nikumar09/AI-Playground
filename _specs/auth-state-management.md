# Spec for auth-state-management
branch: claude/feature/auth-state-management
figma_component (if used): N/A

## Summary
Add a global Firebase Auth state listener that exposes the current authenticated user via a `useUser` hook. Any component or page can call `useUser()` to get the current user object (or `null` if logged out). No sign-up, login, or logout flows are in scope — only the realtime listener and hook.

## Functional Requirements
- A React context (`AuthContext`) wraps the app and subscribes to Firebase Auth's `onAuthStateChanged` listener on mount, unsubscribing on unmount.
- The context holds two values: `user` (a Firebase `User` object or `null`) and `loading` (boolean, `true` until the first auth state is resolved).
- A `useUser` hook reads from `AuthContext` and returns `{ user, loading }`.
- The hook must be usable from any page or component inside the app.
- `AuthContext` is provided high enough in the tree that dashboard pages and public pages can both access it.
- Any existing component that currently hard-codes or stubs a user value should be updated to consume `useUser` instead.

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- Hook called outside of `AuthProvider` should throw a clear error message.
- `loading: true` on first render before Firebase resolves — consumers must handle this state (e.g. avoid redirects or renders that depend on `user` before loading is complete).
- Firebase `User` object reference changes on token refresh — consumers should not rely on referential equality.

## Acceptance Criteria
- `useUser()` returns `{ user: null, loading: false }` when no user is authenticated.
- `useUser()` returns `{ user: <FirebaseUser>, loading: false }` when a user is signed in.
- `loading` is `true` only between mount and the first `onAuthStateChanged` callback.
- The hook works correctly in both `app/(public)/` and `app/(dashboard)/` route groups.
- All existing components that previously used a stubbed or hardcoded user value now use `useUser`.
- Calling `useUser` outside of `AuthProvider` throws a descriptive error.

## Open Questions
- Should `AuthProvider` live in the root layout (`app/layout.tsx`) so both public and dashboard routes share it, or only in the dashboard layout? Yes
- Should the `User` type be re-exported from the auth module for convenience across the codebase? No

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `useUser` returns `{ user: null, loading: false }` when auth state resolves to unauthenticated.
- `useUser` returns a user object when auth state resolves to authenticated.
- `loading` is `true` before `onAuthStateChanged` fires and `false` after.
- Calling `useUser` outside `AuthProvider` throws an error.
- Existing components that consume `useUser` render correctly with both a `null` and a populated user.
