# Plan: Auth Login & Signup Forms

## Context
The `/login` and `/signup` routes currently render empty stubs. This plan implements the auth forms described in `_specs/auth-login-signup-forms.md`: a shared `AuthForm` component with email/password fields, a password visibility toggle, light client-side validation, and a cross-link between the two pages. No real auth backend — just `console.log` on submit.

---

## Approach

Build a single reusable `AuthForm` client component (per the spec's open question answer: "single reusable component"), then drop it into both page stubs. The component accepts a `mode` prop (`"login" | "signup"`) that controls labels, button text, and the switch link.

---

## Files to Create

### 1. `components/AuthForm/AuthForm.tsx`
- `"use client"` directive (needs `useState`)
- Props: `{ mode: "login" | "signup" }`
- State: `email`, `password`, `showPassword`, `emailError`, `passwordError`
- **Light validation on submit:**
  - Email: must match `/\S+@\S+\.\S+/`
  - Password: minimum 8 characters
  - Native `required` on both inputs as first line of defence
- **On valid submit:** `console.log({ email, password })` — no network call
- **Password toggle:** `<button type="button">` with `Eye`/`EyeOff` from `lucide-react`; toggling `showPassword` flips `type="password"` ↔ `type="text"`
- **Switch link:** plain `<a href="...">` (not Next.js `<Link>`) so navigation is a full page reload, resetting all state — as specified
- **Tab order in DOM:** email input → toggle button → submit button → switch link `<a>`
- Renders inside the existing `.center-content` / `.page-content` wrappers (same as current stubs)

```
mode="login"   → title "Log in to Your Account", button "Login",   link → /signup
mode="signup"  → title "Create an Account",       button "Sign Up", link → /login
```

### 2. `components/AuthForm/AuthForm.module.css`
Uses `@reference "../../app/globals.css"` pattern (same as Avatar, Navbar).

Classes needed:
- `.form` — flex column, gap
- `.field` — label + input wrapper
- `.label` — small, muted body text
- `.input` — full-width, dark background (`bg-lighter`), rounded, themed border, focus ring in `--color-primary`
- `.passwordGroup` — relative wrapper holding input + toggle in a row
- `.toggleBtn` — icon-only button, no background, positioned at right of password group
- `.error` — small red text using `--color-error`
- `.switchText` — centred muted text with `.switchLink` anchor styled in `--color-primary`

### 3. `components/AuthForm/index.ts`
```ts
export { default } from './AuthForm'
```

---

## Files to Modify

### 4. `app/(public)/login/page.tsx`
Replace stub with:
```tsx
import AuthForm from "@/components/AuthForm"
export default function LoginPage() {
  return <AuthForm mode="login" />
}
```

### 5. `app/(public)/signup/page.tsx`
Replace stub with:
```tsx
import AuthForm from "@/components/AuthForm"
export default function SignupPage() {
  return <AuthForm mode="signup" />
}
```

---

## Test File to Create

### 6. `tests/components/AuthForm.test.tsx`
Uses Vitest + React Testing Library. Tests:

1. Login mode renders email input, password input, and "Login" submit button
2. Signup mode renders email input, password input, and "Sign Up" submit button
3. Password field defaults to `type="password"` on both modes
4. Clicking the toggle button switches password field to `type="text"` and back
5. Submitting with valid values calls `console.log` with `{ email, password }`
6. Submitting with empty fields does not call `console.log` (native validation blocks it; simulate by leaving inputs empty and firing submit)
7. Login page renders a link with `href="/signup"`
8. Signup page renders a link with `href="/login"`

Use `vi.spyOn(console, 'log')` to assert console output. Use `fireEvent` or `userEvent` for interactions.

---

## Verification
1. `npm run dev` → visit `http://localhost:3000/login` and `http://localhost:3000/signup`
2. Check visual: dark-themed form, centered, matching site aesthetic
3. Submit with empty fields — native validation blocks; no console.log
4. Submit with invalid email (e.g. `notanemail`) — inline error appears
5. Submit with short password (< 8 chars) — inline error appears
6. Submit with valid email + long enough password — `console.log({ email, password })` visible in browser console
7. Toggle password visibility icon — field switches type
8. Click cross-link — navigates to the other page, form is blank
9. `npm run test` — all tests pass