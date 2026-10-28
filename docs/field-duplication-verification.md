# Field creation and duplication verification (#18)

New boolean fields previously started with an invalid empty-string default. Copying
consent reset true to false; copying a configured table replaced its columns with
the two starter columns, orphaning default row cell keys.

`createCustomField` now creates valid false defaults for boolean/consent and starter
columns only for new tables. Copies deeply clone settings, retain defaults and
references to existing dependencies, and receive a fresh field ID. Column IDs stay
stable within the copied table so default rows still bind to their columns. Copy
labels are capped at the existing 120-character limit. The builder uses this pure
helper without changing draft/publication, history or save behavior.

## Verification

- Frozen install, tests, typecheck, lint (zero errors), production build and diff
  checks passed. Existing large client chunk warning remains.
- API regressions save/reload created boolean, true consent, custom numeric table
  and duplicates. Tests cover zero/false/empty defaults, repeated independent IDs,
  nested column/layout/condition isolation and maximum-length labels.
- Local Chromium at 1440×1000 and 390×844: add boolean, copy true consent, copy a
  configured numeric table, edit copied column, undo/redo, repeat copy, simulate a
  503 save failure, retry, then reload. Original columns and zero cell value remain
  unchanged; draft survives the failed save. No browser errors or page overflow.
- Screenshots visually inspected: Arabic RTL, editor controls and copied table
  configuration remain readable at both widths. Evidence outside Git:
  `/workspace/onyx-deliverables/field-copy-browser-qa.json`,
  `field-copy-desktop.png`, `field-copy-mobile.png`.

Stacked on #15 to avoid conflicting with its client migration; retarget develop
only after predecessors integrate. No production writes, migrations or permission
changes. Merge remains pending independent review and positive branch-retention
setting evidence. No claim of remote CI acceptance is made by local checks.
