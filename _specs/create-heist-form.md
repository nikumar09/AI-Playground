# Spec for create-heist-form
branch: claude/feature/create-heist-form
figma_component (if used): N/A

## Summary
Build a form in `app/(dashboard)/heists/create/page.tsx` that allows authenticated users to create a new heist document in the Firestore `heists` collection. The form collects the user-facing fields from `CreateHeistInput` — title, description, and the assignee. `createdAt` is set to `serverTimestamp()` and `deadline` is computed as 48 hours from submission. On success, the user is redirected to `/heists`.

## Functional Requirements
- The form renders three user-facing fields:
  - **Title** — text input, required
  - **Description** — textarea, required
  - **Assign to** — dropdown/select populated with users fetched from the Firestore `users` collection (each entry shows the user's codename)
- `createdBy` and `createdByCodename` are sourced from the currently authenticated user via `useUser` — not shown as form fields.
- `assignedTo` (uid) and `assignedToCodename` are set from the selected user in the dropdown.
- `createdAt` is set to `serverTimestamp()` on submit — not shown as a form field.
- `deadline` is computed as `serverTimestamp()` + 48 hours — not shown as a form field.
- `finalStatus` is always `null` on creation.
- On successful submission, the document is written to the `heists` collection using `heistsCollection` from `lib/firestore.ts`, then the user is redirected to `/heists` via `router.push`.
- The submit button is disabled while the write is in-flight.
- Submission errors are shown inline as a form-level error message.
- The users collection is fetched once on mount; a loading state is shown in the dropdown while fetching.

## Figma Design Reference (only if referenced)
N/A

## Possible Edge Cases
- `users` collection is empty or returns only the current user — the dropdown should still render, even if the only option is the current user.
- Firestore write fails — show an error message and re-enable the submit button.
- `useUser` returns a user without a `displayName` — fall back to the user's email or uid as the codename.
- User navigates away mid-form — no cleanup needed (no auto-save).

## Acceptance Criteria
- Submitting the form with valid inputs creates a document in the `heists` Firestore collection.
- The created document contains all fields required by `CreateHeistInput`.
- `createdAt` uses `serverTimestamp()` and `deadline` is 48 hours ahead.
- After a successful write, the user is redirected to `/heists`.
- The submit button is disabled while the request is in-flight.
- A form-level error message is shown if the write fails.
- The assignee dropdown is populated from the `users` Firestore collection.

## Open Questions
- Should the current user be included as an option in the assignee dropdown, or excluded? excluded
- Should the assignee dropdown show the user's email as a fallback if no codename is available? yes

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Renders title, description, and assignee fields.
- Submitting with valid inputs calls `addDoc` with the correct shape.
- `createdBy` and `createdByCodename` are sourced from the current user, not form inputs.
- Submit button is disabled while in-flight.
- An error message is shown when `addDoc` rejects.
- On success, `router.push` is called with `/heists`.
