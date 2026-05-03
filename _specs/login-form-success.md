# Spec for login-form-success
branch: claude/feature/login-form-success
figma_component (if used): N/A

## Summary
Wire the login form to Firebase Authentication so that submitting valid credentials signs the user in. On success, display an inline success message instead of redirecting. The existing `AuthForm` component already calls `signInWithEmailAndPassword` but currently redirects to `/heists` for both login and signup — this spec replaces that redirect with a success state for the login mode only.

## Functional Requirements
- Submitting the login form with valid credentials calls `signInWithEmailAndPassword`.
- On success, an inline success message is shown (e.g. "You're logged in!").
- The form fields and submit button remain visible after success (no full page replacement).
- No redirect occurs after a successful login.
- On failure, the existing mapped error message is shown as it is today.
- The submit button remains disabled while the request is in-flight (already implemented).
- The success message is only shown for `mode="login"` — signup behaviour is unaffected.

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- User submits the form a second time after seeing the success message — the form should allow resubmission (success state clears on new submit).
- Firebase returns a success but the user object is not yet available — success message still shows immediately based on the resolved promise, not on `useUser`.
- Network error after partial sign-in — handled by the existing `mapFirebaseError` fallback.

## Acceptance Criteria
- Submitting valid login credentials shows a success message without navigating away.
- The success message is visible and distinct from error messages.
- Submitting invalid credentials still shows the appropriate error message.
- The signup flow (`mode="signup"`) is unaffected — it continues to redirect after success.
- The submit button re-enables if an error occurs, matching existing behaviour.

## Open Questions
- What should the exact wording of the success message be? (e.g. "You're logged in!", "Login successful.") Login successful
- Should the success message replace the form, or appear below the submit button? show success message below the submit button

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Submitting valid login credentials shows a success message.
- Success message is not shown before submission.
- Submitting invalid credentials shows an error message, not a success message.
- Signup mode still calls redirect after success (success message not shown).
