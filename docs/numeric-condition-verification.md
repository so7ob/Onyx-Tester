# Numeric condition thresholds

`gt`/`lt` previously accepted arbitrary threshold text. `Number('not-a-number')`
produced NaN and the comparison silently returned false, hiding a `show` field.
The negative regression failed on the previous implementation.

A shared `numericConditionError` rejects empty/whitespace and nonfinite numeric
thresholds in form validation and runtime condition evaluation, before checking
whether the source value is missing. Numeric strings (including zero, negatives,
decimals, padded strings and exponent notation) remain accepted. Text `eq`/`ne`
and `filled` retain their semantics. Existing source-value coercion is unchanged.

The editor marks the condition value invalid. Preview/execution rendering shows a
localized alert and disables an affected active field instead of silently hiding
it or crashing. API validation remains authoritative. Runtime validation also
rejects malformed stored conditions before applying visibility, including inactive
fields. Report row generation rejects invalid conditions rather than omitting
content silently. Existing malformed definitions/snapshots are not rewritten;
they require correction or a new execution with a corrected form as appropriate.

Verification:
- Unit tests: malformed/nonfinite/overflow/empty thresholds, missing source values,
  inactive fields, valid zero/decimal/exponent thresholds and text equality.
- API: invalid definition leaves version unchanged; invalid runtime form rejects;
  valid threshold hides at zero, reveals at positive value and enforces required
  answers; failed save preserves result version and correction succeeds.
- Browser: invalid preview and save rejection, dirty-navigation cancellation,
  repeated corrections, publish, repeated hide/show, execution save/reload; Arabic
  RTL desktop/mobile and no browser errors. Local screenshots and JSON evidence
  are in `/workspace/onyx-deliverables/condition-*`.
- Tests, typecheck, lint, build and diff checks passed. Existing large client chunk
  warning remains. No dependency, schema, permission, production or branch changes
  beyond the isolated feature branch. No separate issue creation.

Stacked after #20; merge only after predecessor integration, independent review,
and positive branch-retention evidence. Remote CI is reported separately from
local checks; denied Actions API reads are not retried.
