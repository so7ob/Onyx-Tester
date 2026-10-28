# Dynamic table validation — issue #10

## Scope and baseline

The work is stacked on PR #9, commit
`154ef00f0c9ba117d466459a499c0b6453b0f4b1`, to reuse the existing lint,
domain and server extraction changes in PRs #5, #6, #7 and #9. PR #8's
independent CI trigger fix was inspected and is not duplicated here.
Remote refs and PR metadata were checked on 2026-10-28; PRs #5–9 were
open, unmerged and reported `draft: false` despite their descriptive text.

Before the fix, the new API regression test failed because a finalized
result with a required table set to `[]` returned HTTP 200 instead of 400.
The shared table validator now rejects empty required tables, malformed
rows/cells, empty/duplicate row identities and cells incompatible with the
declared number/date/boolean/text column. Errors are localized in Arabic.

No schema, production data, permissions, client components or layout changed.
Existing malformed records are not rewritten; invalid values must be corrected
before saving them again. Empty draft tables remain valid.

## Acceptance evidence

`tests/enhancements.mjs` exercises both actual result and preparation route
handlers against ephemeral SQLite, using published forms and simulated identities:

- Required empty tables fail for terminal results and ready preparation.
- Null rows, array cells, empty/duplicate row IDs, invalid numeric values,
  impossible dates and wrong boolean/text types fail.
- Arabic validation errors are returned instead of JavaScript property errors.
- Rejected initial saves create no records; rejected updates preserve versions.
- Zero, false, optional empty text and a valid leap date survive round trips.
- Draft preparation with an empty table can later become ready with valid rows.
- Table-based DOCX/XLSX exports generate successfully.

The existing suites additionally exercise form snapshots, draft/publication
separation, changed/deleted fields, authenticated tester identity, roles,
approved-result immutability, history conflicts, summaries and reports.

## Checks

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged.
- `pnpm test`: passed, including the new table API regressions.
- `pnpm run typecheck`: passed.
- `pnpm run lint`: passed with no errors or warnings.
- `pnpm run build`: passed; reports the existing large client chunk warning.
- `git diff --check`: passed.
- Browser/visual QA: not run; this change does not modify UI components.
- Production/deployment testing: not run; no deployment authorized in this scope.

The feature PR remains stacked until #9 and its prerequisites are integrated
into `develop`. CI for stacked PR bases is a known pending fix in #8; local
verification does not claim remote CI success. No branches are deleted.
