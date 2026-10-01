# ADR 0002 – Keep vinext + Cloudflare D1/R2 + Drizzle

Date: 2026-10-01
Status: Accepted

## Context
The application runs on vinext (Cloudflare's Vite-based Next.js), Cloudflare D1
(SQLite binding), R2 (object storage), and Drizzle ORM. The Sites hosting
provides dispatch-owned ChatGPT auth, D1, and R2 bindings. These are proven for
the existing behavior and the import (Issue #1) committed to them.

## Decision
Keep vinext + D1/R2 + Drizzle + pnpm as the stack. Do not introduce a second
framework, a separate server process, or a different ORM as part of refactoring.

## Alternatives considered
- Plain Next.js (not vinext): would lose the Workers/D1/R2 integration the
  hosting provides.
- A separate API service: the project size and the dispatch-owned auth model do
  not justify the operational split.
- A different ORM: Drizzle migrations and the typed schema already work.

## Consequences
- The app-router convention (`app/`) is mandatory for routes.
- Local dev simulates D1/R2 via `vite.config.ts` + the Sites plugin.
- We retain the `components/ui` shadcn registry and the `build/` Sites plugin.
