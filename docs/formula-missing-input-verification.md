# Missing formula operands

The editor explicitly promises that missing formula inputs remain empty. Before
this fix, `10 / [missing]` substituted zero for the absent reference and threw
«لا يمكن القسمة على صفر.» before the missing-input check. The new regression
reproduced that error on the unchanged evaluator.

The arithmetic parser now carries an internal null marker for an unknown operand
through unary signs, sums, products and parentheses. A missing denominator yields
an empty calculated value. An explicitly known zero denominator still throws,
including a zero obtained from arithmetic. Parsing continues across missing
operands, so malformed syntax, invalid input types and an independent `1/0` are
not hidden. No eval, external functions, schema or identity changes.

Verification: frozen install, test/typecheck/lint/build/diff passed. API regressions
cover both preparation and execution: save/reload with missing input, reject real
zero without advancing the version, correct/retry, repeated clear/re-entry and
server replacement of a spoofed calculated answer. Existing identity, permissions,
form snapshots and reports remain covered. Build retains its client chunk warning.

GitHub issue creation was rejected by automatic approval review as an unauthorized
external issue publication. No issue was created or retried. Implementation and
verification continue under the existing development authorization; no issue
number is assumed. Merge remains blocked on branch-retention evidence and review.
