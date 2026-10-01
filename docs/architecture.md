# Onyx-Tester Architecture

This document records the architectural intent for Onyx-Tester: the Arabic RTL
ERP upgrade-test application built on [vinext](https://github.com/cloudflare/vinext)
(Cloudflare's Vite-based Next.js), Cloudflare D1 + R2, Drizzle ORM, and pnpm. It
describes the current structure, the target direction, module boundaries, the
dependency direction, and the rules that constrain future changes. It is
authoritative for "where things belong and why"; `AGENTS.md` and `CONTRIBUTING.md`
are authoritative for the process that produces those changes.

The application's behavior — independent per-screen test forms, draft vs.
published form separation, result↔form-version binding, server-enforced tester
identity and permissions, evidence integrity, Arabic RTL + Tajawal, zero/`false`/
empty preservation — is a hard constraint. Refactoring must preserve all of it.

## Current structure (develop after the lint-blocker fix)

```
app/                Next.js/vinext app router — the ONLY place routes may live.
  layout.tsx, page.tsx, globals.css   framework-required entry points.
  api/               API route handlers (route.ts) + shared server helpers.
    auth.ts, storage.ts, types.ts    auth, D1/R2 access, typed row interfaces.
    results/, results/lifecycle/, forms/, test-data/, test-forms/, users/,
    evidence/, evidence/[id]/, test-forms/publish/   route handlers.
  *-model.ts         domain models (model, admin-model, editor-model,
                     advanced-model, navigation-model). [target: move to lib/domain]
  *.tsx              client UI components (form-builder, result-editor,
                     test-preparation, user-manager, workspace, configured-fields,
                     apply-form-defaults, advanced-properties, form-fields).
                     [target: move non-route UI to components/app/]
  form-export.ts, chatgpt-auth.ts   pure export logic / server-only auth helper.
components/
  ui/                shadcn registry components, vendored verbatim (do not edit).
  connector-error.tsx   Sites connector surface error UI.
lib/                 Sites connector integration (contract, errors, preview, utils).
db/                  Drizzle schema (schema.ts) and D1 client (index.ts).
drizzle/             checked-in SQL migrations (0000–0005) + meta.
build/               Sites Vite plugin + workers (build-time, not application code).
scripts/             framework runner, install, env, execution profile.
tests/               node-based behavioral + architecture-contract suites.
docs/                guides, worklog, this file, ADRs.
.github/             verify.yml workflow + issue/PR templates.
```

The known debt: `app/` mixes framework routes, domain models, and UI components.
The lint-blocker fix (PR #5) already added typed D1 rows and removed `any`; the
follow-up refactor extracts domain models and pure logic out of `app/` so that
`app/` contains only routes that delegate to organized modules.

## Target structure (after the refactor PR)

```
app/                            framework routes ONLY.
  layout.tsx, page.tsx, globals.css
  api/.../route.ts              thin handlers that validate + call services.
  chatgpt-auth.ts               server-only dispatch auth helper (referenced by README).
lib/
  domain/                       pure domain models & logic (no React, no D1).
    plan.ts, result.ts, users.ts, fields.ts, forms.ts, export.ts, navigation.ts
  server/                       D1/R2 access + auth (imports domain, not app/).
    db.ts, rows.ts, auth.ts, storage.ts
  shared/                       small, organized, cross-cutting types & helpers.
  client/                       client-only helpers (fetch wrappers, ids).
components/
  app/                          application UI (imports domain types only).
  ui/                           shadcn vendored (unchanged).
db/, drizzle/, build/, scripts/, tests/, docs/, .github/   unchanged.
```

## Module boundaries and dependency direction

The dependency direction is one-way. Arrows point "depends on".

```
app/api/*/route.ts ──▶ lib/server ──▶ lib/domain ──▶ lib/shared
components/app     ──▶ lib/domain ──▶ lib/shared
app/*.tsx (routes)─▶ components/app
```

Rules:
1. `lib/domain` imports nothing from `app/`, `components/`, `lib/server`, or
   `lib/client`. It is pure TypeScript (types + functions), testable in Node with
   no D1, no React, no Workers runtime.
2. `lib/server` imports `lib/domain` and `lib/shared`; it owns D1/R2 access and
   auth. It never imports React or anything from `components/`.
3. `lib/client` imports `lib/domain` (types only) and `lib/shared`. It owns
   fetch wrappers and client ids; it never imports server-only code
   (`cloudflare:workers`, `lib/server`, `app/chatgpt-auth`).
4. `components/app` imports `lib/domain` (types) and `lib/client`; never imports
   `lib/server` or `app/api` server internals.
5. `app/api/*/route.ts` imports `lib/server` + `lib/domain`; it validates input,
   authorizes, calls a service, and returns JSON. It must not contain domain
   logic or row mapping beyond delegating to `lib/server`.
6. `components/ui` is vendored from the shadcn registry. Do not edit it except to
   re-sync with the registry. The ESLint override for these files stays.
7. No circular imports. `lib/domain` is the leaves; nothing imports back into
   `app/` except the routes themselves.

## Client vs server boundary

Server-only modules (must never be imported by client code):
- `app/api/**` (route handlers and `auth.ts`, `storage.ts`, `types.ts`).
- `app/chatgpt-auth.ts` (dispatch-owned; server-only per README).
- `lib/server/**`.
- `db/index.ts` (reads the D1 binding from the Workers env).

Client modules (`"use client"`) may import: React, `components/ui`,
`components/app`, `lib/client`, `lib/domain` (types only via `import type`), and
each other. The architecture-contract test guards against server modules leaking
into client bundles.

## Data and identity

- D1 binding `DB` and R2 binding `BUCKET` are declared in `.openai/hosting.json`
  and simulated locally by `vite.config.ts`. `db/index.ts` reads `env.DB`.
- Identity comes from dispatch headers (`oai-authenticated-user-id`,
  `oai-authenticated-user-email`, `oai-authenticated-user-full-name*`). Local
  preview simulates a single owner on loopback only; the simulation is compiled
  out of production builds (`__ONYX_LOCAL_PREVIEW__`).
- `ONYX_OWNER_EMAIL` is a server secret; the first owner request binds the stable
  Site user id. Owner permissions are immutable. Every data API checks the
  requested operation and allowed ONYX system.
- Result saves overwrite any client-provided tester with the authorized current
  user's name and record the stable identity + email. Approved results are
  immutable; new runs archive prior definitions + answers. Optimistic versions
  prevent concurrent overwrites (the `version` column + `WHERE version=?` guard).
- Form changes + revision snapshots write in one D1 batch; a history failure
  rolls back the form update.

## Decisions and alternatives

See `docs/adr/` for individual architecture decision records. The short version:
- Keep vinext + Cloudflare D1/R2 + Drizzle (the proven stack); do not introduce
  a second framework or a separate service for this size.
- Keep the app-router convention (`app/`) for routes; do not fight the framework.
- Extract domain into `lib/domain` (not a full Clean Architecture/DDD layer cake)
  — the project size does not justify more layers.
- Typed D1 row interfaces over `.first<any>()` (landed in PR #5).
- Behavior-preserving refactoring gated by the existing behavioral suites.
- GitHub is the development authority; publishing to Sites is a separate,
  explicitly authorized handoff.

## Limits of this document

- Remote branch protections are NOT enforced yet (connector exposes no ruleset
  mutation); `CONTRIBUTING.md` documents the required rules but an admin must
  apply them. This document does not claim enforcement that does not exist.
- Production operation outside Sites is NOT verified; it requires a trusted auth
  gateway and equivalent D1/R2 bindings. This is out of scope for refactoring.
