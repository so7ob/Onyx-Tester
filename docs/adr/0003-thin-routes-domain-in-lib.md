# ADR 0003 – app/ routes are thin delegators; domain lives in lib/domain

Date: 2026-10-01
Status: Accepted (target; refactor PR in progress)

## Context
`app/` currently mixes framework routes, domain models (`*-model.ts`), and UI
components (`*.tsx`). This couples domain logic to the framework directory and
makes it harder to test domain rules in isolation and to see where things
belong. The app-router convention *requires* routes to live in `app/`, so routes
cannot move; but domain and non-route UI can.

## Decision
`app/` keeps only what the framework requires: `layout.tsx`, `page.tsx`,
`globals.css`, `api/**/route.ts`, and `chatgpt-auth.ts` (referenced by README as
`app/chatgpt-auth.ts`). Domain models and pure logic move to `lib/domain/`;
D1/R2 access and auth move to `lib/server/`; non-route client UI moves to
`components/app/`; client helpers move to `lib/client/`. Routes become thin:
validate input, authorize, call a service, return JSON.

Dependency direction (one-way): `app/api/*/route.ts` → `lib/server` → `lib/domain`
→ `lib/shared`; `components/app` → `lib/domain` → `lib/shared`. `lib/domain`
imports nothing from `app/`, `components/`, or runtime (no React, no D1).

## Alternatives considered
- Full Clean Architecture / DDD layer cake: too many layers for this size.
- Move routes out of `app/`: forbidden by the app-router convention.
- Leave everything in `app/`: preserves the known coupling debt.

## Consequences
- Domain logic becomes unit-testable in Node without D1/React/Workers.
- The architecture-contract test must be updated to assert the new boundaries.
- Re-exports may keep old import paths working during the transition.
