# Mandatory agent workflow
GitHub so7ob/Onyx-Tester is the development source of truth. Preserve Sites project identity and its source integration; publishing is a separate explicit task.
Read README.md, CONTRIBUTING.md, docs and applicable instructions; verify project root, Git status, branches, remotes and existing changes before commands.
Fetch GitHub refs and safely update develop without discarding local changes. Reuse a matching Issue or create one with scope, affected files, compatibility risks, acceptance criteria and tests.
Create feature/<issue>-<name>, fix/<issue>-<name> or chore/<issue>-<name> from develop. Stay within Issue scope.
Add meaningful behavioral and architecture contract tests. Run pnpm test, pnpm run typecheck, pnpm run lint, pnpm run build and git diff --check. Never disable failing checks or claim success when blocked.
Use Conventional Commits referencing the Issue; push the work branch and open a linked PR to develop. No direct application changes on main/develop. No force push, reset --hard or clean that discards work.
Do not merge before required successful checks and independent review. Keep blocked PRs draft/open. Promote develop to main only through a separate reviewed release PR.
Do not commit secrets, live user data, database dumps, dependencies or generated outputs. Code transfer does not transfer D1/R2/auth services.
