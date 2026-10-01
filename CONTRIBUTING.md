# Contribution and releases
Follow AGENTS.md. GitHub is the authoritative development repository. `main` contains stable releases; `develop` integrates reviewed development. See `docs/architecture.md` for where code belongs and `docs/adr/` for why.

## 1. Before you change code
Inspect root, documentation, the architecture/ADR record, Git status and remotes; fetch GitHub and update `develop` safely. Search/reuse an Issue; otherwise open one describing: problem, scope, affected files, compatibility/data risks, acceptance criteria, and a test plan.

## 2. Branch from develop
`feature/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>`, or `refactor/<issue>-<slug>`. Stay within the Issue scope.

## 3. Structure and dependencies
Place code per `docs/architecture.md`: routes only in `app/`; pure domain in `lib/domain`; D1/R2 + auth in `lib/server`; client UI in `components/app`; vendored UI in `components/ui` (do not edit except to re-sync with the shadcn registry). Dependency direction is one-way; no circular imports. Client code never imports server-only modules (`cloudflare:workers`, `app/api/**` internals, `app/chatgpt-auth.ts`, `lib/server`).

## 4. Implement and test
Implement scoped changes. Add behavioral and architecture-contract tests for affected behavior. Validate external input with the existing `unknown`-accepting validators. Preserve `0`/`false`/empty, optimistic version guards, server-enforced tester identity, draft/published separation, and result↔form-version binding.

## 5. Required checks
Install with `pnpm install --frozen-lockfile` (keep the lockfile; do not switch package managers). Run, in order:
- `pnpm test` — model + enhancements + architecture suites
- `pnpm run typecheck` — `tsc --noEmit`
- `pnpm run lint` — `eslint`; must be **0 errors**
- `pnpm run build` — portable Vinext production build
- `git diff --check` — no whitespace errors

Failed checks block completion and merging. Never disable a failing rule or exclude a file to bypass failure; do not invent success. Distinguish a code failure from an external blocker.

## 6. Commit, push, open PR
Commit as Conventional Commits (`feat`/`fix`/`chore`/`docs`/`test`/`refactor`: description (#issue)). Push and open a PR to `develop` with evidence (gate results), affected files, and risks. Keep PRs scoped — do not bundle refactoring, fixes, and features in one PR.

## 7. Review and release
Obtain independent review and all required successful checks before merging. Release `develop` to `main` using a separate release PR; publishing Sites needs explicit authorization and a verified project-preserving handoff.

Never change Site remotes/identity or deploy as part of ordinary source changes. Never force push or discard existing work. Keep pnpm and its lockfile. No secrets, live user data, DB dumps, dependencies, or generated outputs committed. No DB migration or production data touch as part of refactoring.

## Branch protections (remote enforcement — NOT yet applied)
Branch protections are not yet enforced remotely: the available connector exposes no protection/ruleset mutation and the browser session is unauthenticated. An organization administrator must configure both `main` and `develop`: require PR, ≥1 independent approval, dismiss stale approvals, require status checks (`pnpm test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`), no force pushes/deletion/direct updates including administrator bypass. Confirm the plan supports private-repository protections. Documentation alone is not remote enforcement.
