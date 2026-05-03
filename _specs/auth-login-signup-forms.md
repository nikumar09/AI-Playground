# Spec for auth-login-signup-forms
branch: claude/feature/auth-login-signup-forms
figma_component (if used): N/A

## Summary
Add authentication forms to the `/login` and `/signup` public routes. Each page renders a form with email and password fields, a password visibility toggle, and a submit button. Submitting logs the field values to the console (no real auth yet). Both pages include a link to switch to the other form.

## Functional Requirements
- The `/login` page renders a form with:
  - An email input field (type="email")
  - A password input field (type="password") with a show/hide toggle icon
  - A "Login" submit button
  - A link/prompt to navigate to `/signup` ("Don't have an account? Sign up")
- The `/signup` page renders a form with:
  - An email input field (type="email")
  - A password input field (type="password") with a show/hide toggle icon
  - A "Sign Up" submit button
  - A link/prompt to navigate to `/login` ("Already have an account? Log in")
- The password visibility toggle icon switches the input between `type="password"` and `type="text"` on click
- On form submission, `console.log` the submitted email and password values; no network request is made
- Form submission is prevented if either field is empty (native HTML validation via `required` attributes is sufficient)
- Both forms are rendered within the existing `app/(public)/` layout

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- User submits with one or both fields empty — native `required` validation should block submission
- Password field toggle should not submit the form when clicked
- Navigating between /login and /signup should reset form state (no field values carried over)
- Password visibility state should reset to hidden when toggling between pages

## Acceptance Criteria
- Visiting `/login` shows the login form with email, password (hidden by default), and a "Login" button
- Visiting `/signup` shows the signup form with email, password (hidden by default), and a "Sign Up" button
- Clicking the password toggle icon reveals/hides the password text on both pages
- Submitting either form with both fields filled logs `{ email, password }` to the console
- Submitting with an empty field does not call `console.log`
- Each form has a clearly visible link to switch to the other form, and clicking it navigates correctly
- Both pages are accessible via keyboard (tab order: email → password toggle → submit → switch link)

## Open Questions
- Should the two forms share a single reusable `AuthForm` component, or be implemented as separate page-level components? sigle resuable component
- Should there be any client-side validation beyond native `required` (e.g. email format, minimum password length)? yes, light validations
- Should the switch-form link use Next.js `<Link>` routing or a full page navigation? full page navigation

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Renders email and password fields and a submit button on each page
- Password field defaults to type="password" (hidden)
- Clicking the toggle icon switches the password field to type="text" and back
- Submitting the form with valid values calls console.log with the correct email and password
- Submitting the form with empty fields does not call console.log
- Each page renders a link that points to the other auth route