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

## Current structure (after the domain, server and client extraction stack)

```
app/                Next.js/vinext framework entries and API routes.
  layout.tsx, page.tsx, globals.css
  chatgpt-auth.ts    dispatch-owned server-only authentication helper.
  api/**/route.ts    API handlers; import shared server/domain modules.
components/
  app/              client application UI: workspace, form-builder,
                    configured-fields, form-fields, advanced-properties,
                    apply-form-defaults, result-editor, test-preparation,
                    user-manager.
  ui/               shadcn registry components, vendored verbatim.
  connector-error.tsx  Sites connector surface error UI.
lib/
  domain/           pure models, navigation, templates and form exports;
                    data/plan.json preserves source test/screen identities.
  server/           db, errors, auth, rows and results helpers.
  *.ts, *.mts       Sites connector integration and shared utilities.
db/, drizzle/       schema, D1 client and checked-in migrations 0000–0005.
build/              Sites Vite plugin + workers (build-time integration).
scripts/            framework runner, install, env and execution profile.
tests/              behavioral + architecture-contract suites.
docs/, .github/     guides, ADRs, worklog, CI and contribution templates.
```

PR #5 repairs lint; #7 extracts domain; #9 extracts shared server helpers.
The client follow-up completes ADR 0003's non-route UI move. `app/page.tsx`
delegates to `components/app/workspace.tsx`; the nine client modules retain
all component code and state behavior, changing only their import paths.
API handlers still contain some SQL orchestration; further service extraction
and clearer domain filenames remain scoped follow-ups, not completed work.

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
  app/                          application UI (imports pure domain functions and types).
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
4. `components/app` imports pure `lib/domain` functions/types and `lib/client`; never imports
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
- `app/api/**` (route handlers).
- `app/chatgpt-auth.ts` (dispatch-owned; server-only per README).
- `lib/server/**`.
- `db/index.ts` (reads the D1 binding from the Workers env).

Client modules (`"use client"`) may import: React, `components/ui`,
`components/app`, `lib/client`, pure `lib/domain` functions (types via `import type`), and
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
