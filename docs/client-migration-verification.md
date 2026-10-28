# Client component extraction — issue #14

Completes ADR 0003's remaining client-directory move, stacked on template fix
PR #13. There is no component behavior or styling change.

| Previous path | New path | Responsibility |
| --- | --- | --- |
| `app/workspace.tsx` | `components/app/workspace.tsx` | Navigation, loading, screen/system organization |
| `app/form-builder.tsx` | `components/app/form-builder.tsx` | Draft design, independent import, publication |
| `app/configured-fields.tsx` | `components/app/configured-fields.tsx` | Shared dynamic field renderer |
| `app/form-fields.tsx` | `components/app/form-fields.tsx` | Shared input and request helpers |
| `app/advanced-properties.tsx` | `components/app/advanced-properties.tsx` | Advanced field configuration |
| `app/apply-form-defaults.tsx` | `components/app/apply-form-defaults.tsx` | Explicit default application |
| `app/result-editor.tsx` | `components/app/result-editor.tsx` | Execution, evidence, review and history |
| `app/test-preparation.tsx` | `components/app/test-preparation.tsx` | Test selection and preparation |
| `app/user-manager.tsx` | `components/app/user-manager.tsx` | User/role editor |

`app/page.tsx` delegates to the new workspace path. Relative domain imports
gain one directory level; other component code is byte-for-byte identical
after normalizing that path change. API routes, server auth helper, CSS,
vendored components, source plan and database schema remain unchanged.

Architecture tests require all nine files at their new locations, restrict
root `app/` files to framework entries/auth, and inspect imports of every
application component for server-only dependencies. The current architecture
map now records the completed moves and the remaining service-extraction debt.

Verification: all behavioral/architecture suites, TypeScript, lint (no errors
or warnings), production build and whitespace checks pass. Build retains its
existing client chunk-size warning. Chromium desktop/mobile QA repeats the
template import/cancel/reselect/save/publish flow, preparation zero → execution,
server tester identity, frozen-result preservation and source independence.
RTL remains intact with no horizontal overflow or uncaught page errors.

Browser QA uses a new local test instance for each run: reusing an instance
with a frozen result correctly continues to show that older form's field IDs.
No live data, hosting, permissions or deployment changes are included.
