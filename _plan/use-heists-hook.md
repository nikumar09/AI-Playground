# Plan: useHeists Hook

## Context
The heists page is a stub with three sections. This plan adds a `useHeists` hook that subscribes to real-time Firestore data via `onSnapshot` and returns a filtered, typed array of `Heist` objects. The page is updated to consume the hook and render heist titles in each section.

---

## Files to Create

### 1. `hooks/useHeists.ts` (new directory)
`'use client'` hook. Accepts `mode: 'active' | 'assigned' | 'expired'`. Returns `{ heists: Heist[], loading: boolean }`.

**Query per mode:**
- `'active'`: `where('assignedTo', '==', user.uid)`, `where('deadline', '>', Timestamp.now())`
- `'assigned'`: `where('createdBy', '==', user.uid)`, `where('deadline', '>', Timestamp.now())`
- `'expired'`: `where('deadline', '<=', Timestamp.now())`, `where('finalStatus', '!=', null)`

**Subscription logic (in `useEffect` keyed on `[mode, user?.uid]`):**
- If `user` is null: set `heists: []`, `loading: false`, return.
- Build query, call `onSnapshot`, unsubscribe on cleanup.

### 2. `tests/hooks/useHeists.test.tsx`
Tests: correct where clauses per mode, loading transition, empty array when user is null.

---

## Files to Modify

### 3. `app/(dashboard)/heists/page.tsx`
Add `'use client'`, call `useHeists` three times, render title lists under each heading.

### 4. `firestore.indexes.json`
Add composite indexes for `(assignedTo, deadline)`, `(createdBy, deadline)`, `(deadline, finalStatus)`.

---

## Key Decisions
- `heistsCollection` carries the converter — `doc.data()` returns typed `Heist` automatically.
- `Timestamp.now()` used for range comparisons, not JS `Date`.
- No error state — minimal hook surface per spec.
