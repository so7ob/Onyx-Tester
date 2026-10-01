# ADR 0001 – Record architecture decisions

Date: 2026-10-01
Status: Accepted

## Context
Onyx-Tester is a small, behavior-rich application (independent test forms,
draft/published separation, version-bound results, server-enforced permissions,
evidence integrity). Changes are made through GitHub PRs by agents and humans.
Without a written record, the rationale behind structural choices is lost and
later contributors re-litigate settled questions.

## Decision
Record architecture decisions as ADRs in `docs/adr/`. Each is dated, numbered,
status-tagged (Proposed / Accepted / Superseded), and short. ADRs are history:
once Accepted they are not rewritten; a new decision Supersedes by number.

## Consequences
- Adds a small documentation obligation for non-trivial structural choices.
- Reviewers can trace *why* a boundary exists before moving it.
- The index in `docs/adr/README.md` is the entry point.
