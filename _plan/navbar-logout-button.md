# Plan: Navbar Logout Button

## Context
The Navbar had a static, non-functional "Logout" button hardcoded to always render. Now that `useUser` provides real auth state, this button should be wired to Firebase Auth's `signOut`, conditionally shown only when a user is authenticated, and disabled while the request is in-flight. Sign-out errors are logged to the console (no UI feedback required per spec).

---

## Files to Modify

### 1. `components/Navbar/Navbar.tsx`
- Import `useState` from React, `signOut` from `firebase/auth`, and `auth` from `@/lib/auth`.
- Add `isLoggingOut` state (boolean, default `false`).
- Add `handleLogout` async function: sets `isLoggingOut(true)`, calls `signOut(auth)`, on catch logs error and resets `isLoggingOut(false)`.
- Move the Logout `<button>` inside the existing `!loading && user` conditional block alongside the user email `<li>`.
- Pass `onClick={handleLogout}` and `disabled={isLoggingOut}` to the button.

### 2. `tests/components/Navbar.test.tsx`
- Add mocks for `firebase/auth` (`signOut`) and `@/lib/auth` (`auth`).
- Update the existing "renders the Logout button" test — it rendered with `user = null`, which no longer shows the button. Replace with two tests: one that confirms it renders with a user, one that confirms it's absent without a user.
- Add tests:
  - Clicking Logout calls `signOut`
  - Button is disabled while sign-out is pending (unresolved promise)
  - Button re-enables after `signOut` rejects

---

## Key Decisions
- **No redirect after logout** — out of scope per spec; the auth listener in `AuthProvider` will update `user` to `null` automatically when Firebase signals sign-out.
- **Error handling** — `console.error` only, no toast or inline message (spec open question resolved).
- **Logout button stays in the `!loading && user` block** — avoids a flash of the button during the initial auth state resolution.

---

## Verification
1. Run `npm run test` — all 33 tests pass.
2. Run `npm run dev`, sign in → Logout button appears with user email.
3. Click Logout → button disables briefly, then user email + button disappear as `onAuthStateChanged` fires with `null`.
4. Sign in again → button reappears.
