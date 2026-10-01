# Mandatory agent workflow
GitHub so7ob/Onyx-Tester is the development source of truth. Preserve Sites project identity and its source integration; publishing is a separate explicit task.
Read README.md, CONTRIBUTING.md, docs/architecture.md, docs/adr/ and applicable instructions; verify project root, Git status, branches, remotes and existing changes before commands.

## 1. Before changing code
Inspect root, documentation, the architecture/ADR record, Git status and remotes; fetch GitHub refs and update `develop` safely without discarding local changes. Reuse a matching Issue, otherwise create one with: goal, scope, affected files, compatibility/data risks, acceptance criteria, and a test plan.

## 2. Branch and scope
Create `feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>`, or `refactor/<issue>-<slug>` from `develop`. Stay within the Issue scope. No application code directly on `main` or `develop`.

## 3. Naming and structure
- Files: `kebab-case.ts`/`.tsx`; ADRs `NNNN-kebab-case.md`. One default export per route file when the framework requires it.
- Put code where `docs/architecture.md` says: routes only in `app/`; pure domain in `lib/domain`; D1/R2 + auth in `lib/server`; client UI in `components/app`; vendored UI stays in `components/ui`. Dependency direction is one-way (`app/api`→`lib/server`→`lib/domain`→`lib/shared`; `components/app`→`lib/domain`→`lib/shared`). No circular imports.
- Client code never imports server-only modules (`cloudflare:workers`, `app/api/**` internals, `app/chatgpt-auth.ts`, `lib/server`). Use `import type` for domain types from client code.

## 4. Validation, errors, and state
Validate all external input with the existing validators (they accept `unknown` and throw localized errors). Never trust client-provided tester identity: the server overwrites it with the authenticated user. Preserve `0`, `false`, and intentionally-empty values. Keep optimistic version guards (`WHERE version=?`) for concurrent overwrites. Server errors return Arabic, actionable messages; never leak secrets, tokens, or PII.

## 5. Required checks (never bypass)
`pnpm install --frozen-lockfile`, then `pnpm test`, `pnpm run typecheck`, `pnpm run lint` (must be **0 errors**), `pnpm run build`, `git diff --check`. Never disable a failing rule, exclude a file, or claim success when blocked. Distinguish a code failure from an external blocker.

## 6. Commits, PRs, releases
Add behavioral and architecture-contract tests for affected behavior. Commit as Conventional Commits (`feat`/`fix`/`chore`/`docs`/`test`/`refactor`: description (#issue)). Push the work branch and open a linked PR to `develop` with evidence and risks. Do not merge before required checks pass and independent review. Promote `develop` to `main` only through a separate release PR.

## 7. Hard limits
No force push, `reset --hard`, or clean that discards work. No secrets, live user data, DB dumps, dependencies, or generated outputs committed. No DB migration or production data touch as part of refactoring; tests use ephemeral in-memory SQLite. Code transfer does not transfer D1/R2/auth services.

## 8. Logging, security, accessibility
Log events without exposing secrets or PII (no tokens, emails, full names in logs). Enforce origin checks on mutating API routes. Server-authorize every data operation and allowed ONYX system, including evidence download. Keep Arabic RTL, `dir="rtl"`, `aria-label`s, `role="alert"`/`"status"`, keyboard reachability, and 44px touch targets. The UI stays private (owner access only); saving users or forms does not change Site sharing.
