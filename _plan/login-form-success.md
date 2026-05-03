# Plan: Login Form Success Message

## Context
`AuthForm` already calls `signInWithEmailAndPassword` on login submit, but currently redirects to `/heists` on success for both login and signup. This spec replaces that redirect for the login mode only with an inline "Login successful" message shown below the submit button. Signup continues to redirect.

---

## Files to Modify

### 1. `components/AuthForm/AuthForm.tsx`
- Add a `successMessage` state (`string`, default `""`).
- In `handleSubmit`, clear `successMessage` at the start (alongside `setFormError("")`).
- For `isLogin` on success: set `successMessage("Login successful")` and call `setIsLoading(false)` — do **not** call `router.push`.
- For signup on success: keep `router.push("/heists")` unchanged.
- Render `{successMessage && <span className={styles.success}>{successMessage}</span>}` below the submit button, mirroring the placement of `{formError && ...}`.

### 2. `components/AuthForm/AuthForm.module.css`
- Add a `.success` class styled distinctly from `.error`:
  ```
  .success {
    @apply text-xs text-green-400 mt-0.5;
  }
  ```
  (Uses a green tone to visually distinguish it from the red `.error` class.)

### 3. `tests/components/AuthForm.test.tsx`
Add tests:
- Submitting valid login credentials shows "Login successful".
- "Login successful" is not present before submission.
- Submitting invalid login credentials shows an error, not "Login successful".
- Signup mode with valid credentials still calls `router.push("/heists")` and does not show "Login successful".

---

## Key Decisions
- **`successMessage` is separate from `formError`** — keeps success and error states independent; no risk of one overwriting the other.
- **`setIsLoading(false)` on login success** — the form stays interactive after login (no redirect, user may want to submit again or navigate manually).
- **CSS token `text-green-400`** — no existing `success` token in `globals.css`; using Tailwind directly keeps it consistent with the existing utility-first approach.

---

## Verification
1. Run `npm run test` — all tests pass including new ones.
2. Run `npm run dev`, go to `/login`, submit valid credentials → "Login successful" appears below the button.
3. Submit invalid credentials → error message appears, no success message.
4. Go to `/signup`, submit valid credentials → redirects to `/heists` as before.