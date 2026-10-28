# Independent template bindings — issue #12

The JSON importer previously regenerated custom IDs and updated conditions and
formulas, but retained old `preparationSource` IDs. Valid templates with custom
preparation sources therefore failed validation. Source-reference builtin values
also belonged to the exporting test instead of the destination test.

`lib/domain/form-template.ts` now owns independent instantiation. It validates
the versioned template before generating IDs, remaps every custom-field reference,
and retains the destination identity, revision guards and immutable builtin
reference. The existing UI retains explicit confirmation, save and publication.
It uses the existing UUID generator, including its browser fallback.

## Verification

- Behavioral tests cover preparation links, conditions, formulas, duplicate and
  malformed source identities, destination source reference, unchanged inputs,
  repeated independent copies and zero/false/empty preparation values.
- Existing API tests continue to cover published/frozen form binding, user roles,
  tester identity, historical results, conflicts and export generation.
- Chromium QA against loopback dev preview and local D1: cancel import without
  writes; select the same JSON file again; import/save/publish; prepare zero;
  open execution and save; verify authenticated tester; import another draft
  with disjoint IDs; verify prior result and source template are unchanged.
- Desktop 1440px and mobile 390px screenshots inspected; Arabic RTL retained,
  no horizontal page overflow and no uncaught browser errors.
- `pnpm test`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`, and
  `git diff --check` pass. Build retains the known large client chunk warning.

Browser screenshots and the QA result JSON are workspace deliverables, not
repository assets. Browser setup uses only ephemeral local preview data.
No schema, production data, permissions or hosting changes.

This branch builds directly on PR #9 and is independent of table-validation
PR #11. After the prerequisite stack lands, retarget to `develop`, recheck
integration-head tests and retain all feature branches.
