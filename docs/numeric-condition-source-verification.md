# Numeric condition source values

After #21 validated thresholds, numeric source values still used unrestricted
`Number(value)` coercion. Null, whitespace, booleans and arrays could therefore
activate numeric show/require/disable conditions as zero or one. The new negative
regression reproduced a true match for null against `gt -1` before this fix.

For `gt`/`lt`, only finite numbers or nonblank strings converting to finite numbers
now participate in comparison. Missing, whitespace-only, nonnumeric, nonfinite,
boolean, array and object values do not match. Legitimate zero, signed/decimal,
padded and exponent numeric strings retain their semantics. `eq`, `ne` and
`filled` behavior is deliberately unchanged, including boolean/text equality.
Threshold errors still throw before the source is examined. API field-value
schemas are unchanged: accepting a number in the pure predicate does not broaden
API custom values beyond their existing string/boolean schema.

Verification:
- Regression matrix for both operators and show/require/disable effects, including
  null, arrays, booleans, whitespace, NaN/Infinity/overflow and finite numeric values.
- Execution and preparation APIs: final/ready saves with nonnumeric sources and
  boolean sources, zero activating required answers, unchanged version on missing
  required answer, successful correction, and rejection of malformed source shapes.
- Chromium desktop/mobile: repeated blank/space/text/nonfinite/zero/decimal source
  edits, boolean toggles, retaining hidden answers, cancelling dirty navigation,
  save/reload, RTL/no page overflow/no browser errors. Screenshots and report are
  outside Git under `/workspace/onyx-deliverables/condition-source-*`.
- Frozen install, tests, typecheck, lint, build and diff checks passed. Existing
  client chunk warning remains. No dependencies, schema, migration, permission,
  live-data or production changes.

Preserved local branch: `fix/numeric-condition-sources`, based on #21 head e873ea8.
This task is delivered locally; no issue/PR creation, remote push, merge, approval
or settings mutation is performed. Remote CI is not claimed. Existing Actions
read restrictions and branch-retention blocker remain in force.
