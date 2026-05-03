# Plan: Route Protection

## Context
Both group layouts are currently server components with no auth awareness — anyone can visit any route regardless of auth state. This adds client-side guards using `useUser` so public routes redirect authenticated users to `/heists`, and dashboard routes redirect unauthenticated users to `/login`. A spinner is shown in both layouts while Firebase resolves the initial auth state to prevent a flash of unprotected content.

---

## Files to Modify

### 1. `app/(public)/layout.tsx`
- Add `'use client'` directive.
- Import `useUser` from `@/context/AuthContext` and `useRouter` from `next/navigation`.
- In a `useEffect` keyed on `[loading, user, router]`: when `!loading && user !== null`, call `router.replace('/heists')`.
- While `loading` is `true`, return a full-screen centered spinner (see Loader below).
- While redirect is pending (user exists but effect hasn't fired yet), also show the spinner.
- When `!loading && user === null`, render `<main className="public">{children}</main>` as before.

### 2. `app/(dashboard)/layout.tsx`
- Add `'use client'` directive.
- Import `useUser` from `@/context/AuthContext` and `useRouter` from `next/navigation`.
- In a `useEffect` keyed on `[loading, user, router]`: when `!loading && user === null`, call `router.replace('/login')`.
- While `loading` is `true` or redirect is pending (user is null but effect hasn't fired yet), return the full-screen centered spinner.
- When `!loading && user !== null`, render `<Navbar /><main>{children}</main>` as before.

### Loader markup (inline in each layout, no separate component needed)
```
<div className="flex min-h-screen items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
</div>
```
Uses `border-primary` (→ `#C27AFF`) and Tailwind's built-in `animate-spin`.

---

## Files to Create

### 3. `tests/components/PublicLayout.test.tsx`
Mock `@/context/AuthContext` (useUser) and `next/navigation` (useRouter). Tests:
- Renders loader while `loading` is `true`.
- Renders children when `user` is `null` and `loading` is `false`.
- Calls `router.replace('/heists')` when `user` is non-null and `loading` is `false`.

### 4. `tests/components/DashboardLayout.test.tsx`
Same mock setup. Tests:
- Renders loader while `loading` is `true`.
- Renders children (and Navbar) when `user` is non-null and `loading` is `false`.
- Calls `router.replace('/login')` when `user` is `null` and `loading` is `false`.

---

## Key Decisions
- **`useEffect` for redirect, not inline during render** — calling `router.replace` in render body causes hydration warnings; `useEffect` is the correct pattern for client-side navigation side effects in App Router.
- **Spinner while loading OR while redirect is pending** — guards against the brief window between `loading: false` and the `useEffect` firing where unprotected content could flash. Achieved by showing the spinner when `loading || (condition_that_triggers_redirect)`.
- **No separate `<Loader>` component** — the markup is two lines and used in only two places; a shared component would be premature abstraction.
- **`router.replace` not `router.push`** — preserves expected back-button behaviour (no auth guard in history stack).

---

## Verification
1. `npm run test` — all tests pass.
2. `npm run dev` — visit `/login` while logged in → redirects to `/heists`.
3. Visit `/heists` while logged out → redirects to `/login`.
4. Spinner is briefly visible on both routes before redirect fires on first load.
