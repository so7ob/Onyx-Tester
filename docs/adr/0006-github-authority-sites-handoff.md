# ADR 0006 – GitHub is the development authority; Sites publishing is a separate handoff

Date: 2026-10-01
Status: Accepted (carried from the import, Issue #1)

## Context
The application was published on Sites (deployment
`appgdep_6abe876386a481918227f9c22e529403`). The source was imported to GitHub
`so7ob/Onyx-Tester` to make GitHub the development authority while preserving the
Site identity, audience, and hosting.

## Decision
GitHub `so7ob/Onyx-Tester` is the authoritative development repository (`main`
= stable releases, `develop` = reviewed development). Changes flow through
Issues → branches (`feature/`, `fix/`, `chore/`, `refactor/`) → PRs to `develop`
→ release PRs to `main`. Publishing reviewed changes back to the Site is a
separate, explicitly authorized handoff; no automatic deployment bridge exists.

## Consequences
- The Site remote, identity, and audience are not changed by ordinary source
  changes.
- Secrets, live user data, DB dumps, dependencies, and outputs are not
  committed.
- Remote branch protections are documented in CONTRIBUTING but NOT yet enforced
  (the connector exposes no ruleset mutation); an admin must apply them.
