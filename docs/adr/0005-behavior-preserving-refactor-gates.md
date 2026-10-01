# ADR 0005 – Behavior-preserving refactoring gated by behavioral suites

Date: 2026-10-01
Status: Accepted

## Context
The application's behavior is the product: Arabic RTL + Tajawal, independent
test forms, draft vs published separation, result↔form-version binding,
server-enforced tester identity/permissions, zero/false/empty preservation,
evidence integrity. Refactoring that changes any of these is a defect, not an
improvement.

## Decision
Refactoring PRs must preserve behavior and prove it by passing the existing
behavioral suites (`tests/model.mjs`, `tests/enhancements.mjs`,
`tests/architecture.mjs`) plus `pnpm run typecheck`, `pnpm run lint`, `pnpm run
build`, and `git diff --check`. Bug fixes that change behavior ship in separate
`fix/` PRs so each change is reviewable on its own. No DB migration, no
production data, no schema change as part of file reorganization.

## Consequences
- Refactoring PRs stay focused on structure; behavior changes are isolated.
- Reviewers can trust that a green gate means behavior is intact.
- The suites are the safety net; weakening or skipping them is not allowed.
