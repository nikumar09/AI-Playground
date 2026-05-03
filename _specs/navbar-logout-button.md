# Spec for navbar-logout-button
branch: claude/feature/navbar-logout-button
figma_component (if used): N/A

## Summary
Add a working Logout button to the Navbar that calls Firebase Auth's sign-out method when clicked. The button is already rendered as a visual placeholder; this spec makes it functional and conditionally visible — only shown when a user is authenticated.

## Functional Requirements
- The Logout button in Navbar calls Firebase Auth `signOut` when clicked.
- The button is only rendered when `useUser()` returns a non-null `user` (i.e. the user is logged in).
- While the sign-out request is in-flight, the button is disabled to prevent double-clicks.
- No redirect is performed after logout — that is out of scope for this feature.
- No confirmation dialog or modal is required.

## Figma Design Reference (only if referenced)
Design reference could not be retrieved — no Figma URL was provided. See Figma manually for details.

## Possible Edge Cases
- `signOut` throws an error — the button should re-enable and not silently swallow the failure (at minimum, log the error).
- User is already signed out when the button is clicked — Firebase handles this gracefully; no special handling needed.
- Button clicked multiple times rapidly — disabled state during in-flight request prevents duplicate calls.

## Acceptance Criteria
- The Logout button is visible in the Navbar when a user is authenticated.
- The Logout button is not rendered when no user is authenticated (`user === null`).
- Clicking Logout calls Firebase Auth's `signOut`.
- The button is disabled while the sign-out request is pending.
- The button re-enables if `signOut` throws an error.
- No redirect occurs after logout.

## Open Questions
- Should a sign-out error be surfaced to the user (e.g. a toast or inline message), or just logged to the console? just logged to the console

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Logout button renders when user is authenticated.
- Logout button does not render when user is null.
- Clicking Logout calls `signOut`.
- Button is disabled while sign-out is pending.
- Button re-enables after `signOut` rejects.
