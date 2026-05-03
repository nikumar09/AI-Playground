# Plan: Create Heist Form

## Context
`app/(dashboard)/heists/create/page.tsx` is a stub with only a heading. This plan implements the full form: three user-facing fields (title, description, assignee), auto-computed server fields, a Firestore write on submit, and a redirect to `/heists` on success. The assignee list is fetched from the `users` collection on mount, excluding the current user.

---

## Files to Modify

### 1. `types/firestore/heist.ts`
Update `CreateHeistInput.deadline` from `FieldValue` to `FieldValue | Timestamp` — `serverTimestamp()` covers `createdAt` but `deadline` (now + 48 h) is a `Timestamp.fromDate()`, which is not a `FieldValue`.

### 2. `app/(dashboard)/heists/create/page.tsx`
Full replacement. Make `'use client'`. Key logic:

**State:**
- `title: string`, `description: string` — controlled inputs
- `assignedToUid: string` — selected user uid from dropdown
- `users: { uid: string; codename: string }[]` — loaded from Firestore on mount
- `usersLoading: boolean` — true while fetching users
- `isLoading: boolean` — true while addDoc is in-flight
- `formError: string` — error message on write failure

**On mount (`useEffect`):**
- `getDocs(collection(db, COLLECTIONS.USERS))`
- Map each doc to `{ uid: data.uid, codename: data.codename ?? data.email ?? data.uid }`
- Filter out the current user's uid
- Set `users` state

**On submit:**
- Validate title and description are non-empty
- Build `CreateHeistInput`:
  - `title`, `description` from state
  - `createdBy: user.uid`, `createdByCodename: user.displayName ?? user.email ?? user.uid`
  - `assignedTo: assignedToUid`, `assignedToCodename` looked up from local `users` array
  - `createdAt: serverTimestamp()`
  - `deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000))`
  - `finalStatus: null`
- `addDoc(heistsCollection, input)`
- On success: `router.push('/heists')`
- On failure: set `formError`, re-enable button

**Form fields** (styled after `AuthForm.module.css` patterns):
- Title — `<input type="text">`
- Description — `<textarea>`
- Assign to — `<select>` populated from `users`, disabled while `usersLoading`

**Reuse:** `db` and `heistsCollection` from `@/lib/firestore.ts`; `COLLECTIONS` from `@/types/firestore`; `useUser` from `@/context/AuthContext`; CSS patterns from `AuthForm.module.css` (`.field`, `.label`, `.input`, `.error`)

---

## Files to Create

### 3. `app/(dashboard)/heists/create/page.module.css`
Scoped styles following `AuthForm.module.css` conventions — `.form`, `.field`, `.label`, `.input`, `.textarea`, `.error`.

### 4. `tests/components/CreateHeistForm.test.tsx`
Mocks: `firebase/firestore` (addDoc, getDocs, collection, serverTimestamp, Timestamp), `@/lib/firestore`, `@/lib/firebase`, `@/context/AuthContext` (useUser), `next/navigation` (useRouter).

Tests:
- Renders title, description, and assignee fields
- Submitting valid inputs calls `addDoc` with correct shape (title, description, createdBy from user, finalStatus null)
- `createdBy`/`createdByCodename` come from `useUser`, not form inputs
- Submit button disabled while in-flight
- Error message shown when `addDoc` rejects
- `router.push('/heists')` called on success

---

## Key Decisions
- **No separate component** — form logic lives directly in the page; it's a single-use form.
- **`Timestamp.fromDate` for deadline** — `serverTimestamp()` resolves server-side, making it impossible to add 48 h; a client-computed `Timestamp` is the correct approach.
- **Current user excluded from assignee dropdown** — per spec; filtered client-side after `getDocs`.
- **Codename fallback chain: `displayName → email → uid`** — covers cases where `displayName` wasn't set at signup.

---

## Verification
1. `npm run test` — all tests pass.
2. `npm run dev` — sign in, go to `/heists/create`, fill form, submit → document appears in Firebase Console under `heists`, redirected to `/heists`.
3. Submit with Firestore offline → error message appears, button re-enables.
