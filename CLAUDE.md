# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FunHeist** ("Pocket Heist") is a Next.js web app for creating and managing playful office missions ("heists") among coworkers. The tagline: _"Tiny missions. Big office mischief."_

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint (Next.js + TypeScript configs)
npm run test       # Run all Vitest tests
```

Run a single test file:
```bash
npx vitest run tests/components/Navbar.test.tsx
```

## Architecture

**Routing** uses Next.js App Router with two grouped layouts:
- `app/(public)/` — unauthenticated routes (splash, login, signup, preview)
- `app/(dashboard)/` — authenticated routes with `Navbar` in the layout; contains heist list, create, and detail pages

**Components** live in `/components/<ComponentName>/` with three files: `ComponentName.tsx`, `ComponentName.module.css`, and `index.ts` (barrel export).

**Styling** is Tailwind CSS 4 with CSS Modules for component-scoped styles. Theme colors are declared as CSS variables in `app/globals.css`: purple primary `#C27AFF`, pink secondary `#FB64B6`, dark backgrounds.

**Path alias**: `@/*` resolves to the project root (e.g., `@/components/Navbar`).

**Tests** use Vitest + React Testing Library with jsdom. Test files mirror source under `/tests/components/`. Use `getByRole` and other semantic queries per RTL conventions.

## Checking Documentation

- **important:** When implementing any lib/framework-specific features, ALWAYS check the appropriate lib/framework documentation using the Context7 MCP server before writing any code.