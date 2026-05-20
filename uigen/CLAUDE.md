# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time setup: install deps + Prisma generate + migrate
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all Vitest tests
npm run db:reset     # Reset and re-seed the database
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## Architecture

UIGen is a Next.js 15 App Router app where users describe React components in a chat interface and Claude generates them with live preview.

### AI Generation Flow

1. User submits a message in `ChatInterface` → sent to `/api/chat` route
2. `/api/chat` calls Anthropic Claude (or `MockLanguageModel` if no `ANTHROPIC_API_KEY`) via Vercel AI SDK with streaming
3. Claude responds with tool calls (`str_replace_editor`, `file_manager`) to create/modify files
4. Tool results are processed in `FileSystemProvider` which updates the in-memory `VirtualFileSystem`
5. `PreviewFrame` re-renders the iframe using Babel-transpiled JSX from the virtual FS

### Virtual File System

`lib/file-system.ts` — all files live **in memory only** (no disk writes). The FS serializes to JSON for persistence in the database `Project.data` field. `FileSystemProvider` (`lib/contexts/file-system-context.tsx`) is the React context wrapping it, handling AI tool calls and exposing refresh triggers.

### State Management

Two main contexts:
- **`ChatProvider`** (`lib/contexts/chat-context.tsx`): wraps Vercel AI SDK's `useChat`, manages message history, calls `/api/chat`
- **`FileSystemProvider`** (`lib/contexts/file-system-context.tsx`): manages virtual FS state, processes AI tool call results, tracks selected file

### Layout

`app/main-content.tsx` — three-panel resizable layout:
- Left panel: `ChatInterface`
- Right top: tab-switched between `PreviewFrame` (iframe) and code view
- Right bottom (code tab): `FileTree` + `CodeEditor` (Monaco)

### Authentication

JWT sessions via `jose` (7-day, HttpOnly cookies). Logic in `lib/auth.ts` and server actions in `actions/index.ts`. Anonymous users can use the app; projects only persist for authenticated users. `middleware.ts` protects routes.

### Provider / LLM

`lib/provider.ts` returns an Anthropic Claude Haiku model if `ANTHROPIC_API_KEY` is set, otherwise falls back to `MockLanguageModel` that returns static component templates — the app is fully functional without an API key.

### Database

Prisma + SQLite (`prisma/dev.db`). Two models: `User` (email/password auth) and `Project` (stores `messages` and `data` as JSON blobs — `data` is the serialized virtual FS).

## Key Paths

| Path | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | AI streaming endpoint |
| `src/lib/file-system.ts` | Virtual FS implementation |
| `src/lib/provider.ts` | LLM provider selection |
| `src/lib/prompts/generation.tsx` | System prompt sent to Claude |
| `src/lib/tools/` | `str_replace_editor` and `file_manager` tool definitions |
| `src/lib/transform/jsx-transformer.ts` | Transforms JSX → runnable HTML for iframe |
| `src/lib/contexts/` | `ChatProvider` and `FileSystemProvider` |
| `prisma/schema.prisma` | DB schema |

## Environment

`ANTHROPIC_API_KEY` in `.env` — optional. Leave empty to use the mock provider.
