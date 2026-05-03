# Plan: Auth State Management (`useUser` hook)

## Context
FunHeist needs a global Firebase Auth listener so any component can read the current user without prop-drilling. The spec answers both open questions: AuthProvider goes in the **root layout** (shared by public + dashboard routes), and the `User` type is **not** re-exported. No login/logout/signup flows are in scope — just the listener, hook, and wiring existing components.

---

## Files to Create

### 1. `lib/auth.ts`
Export the Firebase `Auth` instance, keeping all Firebase SDK concerns inside `lib/`.
```
import { getAuth } from 'firebase/auth';
import { app } from './firebase';
export const auth = getAuth(app);
```

### 2. `context/AuthContext.tsx` (new directory)
A `'use client'` module with two exports:
- `AuthProvider` — subscribes to `onAuthStateChanged(auth, ...)` on mount, unsubscribes on unmount. Provides `{ user, loading }` via React context.
- `useUser()` — reads from the context; throws a descriptive error if called outside `AuthProvider`.

State shape:
- `user`: `User | null` (Firebase `User` from `firebase/auth`)
- `loading`: `boolean` — `true` until the first `onAuthStateChanged` callback fires

---

## Files to Modify

### 3. `app/layout.tsx`
Wrap `{children}` with `<AuthProvider>`. This is a server component so `AuthProvider` is imported as a client component — Next.js handles this boundary automatically.

### 4. `components/Navbar/Navbar.tsx`
Call `useUser()` and display the authenticated user's email (or `displayName` if available) next to the Logout button. While `loading` is `true`, render nothing for that slot. The Logout button stays as a visual placeholder — no action wired yet (that's a future task).

---

## Files to Update (tests)

### 5. `tests/components/AuthContext.test.tsx` (new)
Mock `firebase/auth` with `vi.mock()`. Test cases from the spec:
- Returns `{ user: null, loading: false }` when auth resolves unauthenticated
- Returns `{ user: <FirebaseUser>, loading: false }` when auth resolves authenticated
- `loading` is `true` before `onAuthStateChanged` fires, `false` after
- Calling `useUser` outside `AuthProvider` throws an error

### 6. `tests/components/Navbar.test.tsx`
Wrap `<Navbar />` renders with a helper that provides a mock `AuthContext` value. Add a test that verifies the user's email is rendered when a user is present.

---

## Key Decisions
- **No `User` type re-export** — consumers import directly from `firebase/auth` if needed.
- **`AuthContext` lives in `context/`** — keeps React context concerns separate from Firebase SDK wrappers in `lib/`.
- **`AuthForm` not touched** — it has no user reference today; auth flow wiring is a future task.
- **Navbar shows email, not display name** — email is always present on a Firebase User; displayName may be null.

---

## Verification
1. Run `npm run test` — all existing tests should pass, new tests should pass.
2. Run `npm run dev`, open the app while logged out → Navbar shows no user info.
3. Sign in manually via Firebase Console emulator or directly → Navbar updates in real time.
4. Call `useUser()` in a component outside `AuthProvider` → descriptive error thrown.