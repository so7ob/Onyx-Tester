# ADR 0004 – Typed D1 row interfaces instead of any

Date: 2026-10-01
Status: Accepted (landed in PR #5, Issue #4)

## Context
D1 query results were read through `.first<any>()` / `.all<any>()` / `(x:any)=>`
across the API routes. This passed no type information from the SQL `select`/column
aliases to the handler, so column renames and shape changes compiled silently.

## Decision
Define typed row interfaces in `app/api/types.ts` mirroring the SQL alias maps
and the Drizzle schema (`ResultRow`, `EvidenceRow`, `ScreenFormRow`,
`TestDataRow`, `PublishedFormRow`, `AppUserRow`, `TestFormVersionRow`,
`TestFormRow`, `CountRow`, `EmailRow`). Use `.first<T>()` / `.all<T>()` and
typed filter callbacks. `resultRow` returns `Result` with `status` narrowed to
`Status`; `conflict()` is `:never` so null-guards narrow.

## Consequences
- Column/alias changes surface as compile errors at the call site.
- No runtime behavior change; the SQL and row shapes are identical.
- Lint `no-explicit-any` is satisfied (0 errors / 0 warnings).
