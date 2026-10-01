# Contribution and releases
Follow AGENTS.md. GitHub is the authoritative development repository. main contains stable releases; develop integrates reviewed development.
1. Inspect root, documentation, Git status and remotes; fetch GitHub and update develop safely.
2. Search/reuse an Issue, otherwise describe problem, scope, affected files, compatibility/data risks, acceptance criteria and test plan.
3. Branch from develop as feature/<issue>-<slug>, fix/<issue>-<slug>, chore/<issue>-<slug>.
4. Implement scoped changes and behavior/architecture tests.
5. Install with pnpm install --frozen-lockfile; run pnpm test, pnpm run typecheck, pnpm run lint, pnpm run build, git diff --check.
6. Commit as feat/fix/chore/docs/test: description (#issue), push and open PR to develop with evidence and risks. Failed checks block completion and merging.
7. Obtain independent review and all required successful checks before merging. Release develop to main using a separate release PR; publishing Sites needs explicit authorization and verified project-preserving handoff.
Never change Site remotes/identity or deploy as part of ordinary source changes. Never force push or discard existing work. Keep pnpm and its lockfile.
Branch protections are not yet enforced remotely: available connector has no protection/ruleset mutation. Organization administrator must configure both branches: require PR, 1 independent approval, dismiss stale approvals, required verify check, no force pushes/deletion/direct updates including administrator bypass. Confirm plan supports private-repository protections. Documentation alone is not remote enforcement.
