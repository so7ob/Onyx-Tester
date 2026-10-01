# Architecture Decision Records (ADR)

We record architecture decisions for Onyx-Tester as ADRs, following the
lightweight format popularized by Michael Nygard. Each ADR is a short Markdown
file: Context, Decision, Status, Consequences. ADRs are immutable history once
Superseded; new decisions supersede by number, they do not edit old records.

Index:
- [0001 – Record architecture decisions](./0001-record-architecture-decisions.md)
- [0002 – Keep vinext + Cloudflare D1/R2 + Drizzle](./0002-keep-vinext-cloudflare-stack.md)
- [0003 – app/ routes are thin delegators; domain lives in lib/domain](./0003-thin-routes-domain-in-lib.md)
- [0004 – Typed D1 row interfaces instead of any](./0004-typed-d1-rows.md)
- [0005 – Behavior-preserving refactoring gated by behavioral suites](./0005-behavior-preserving-refactor-gates.md)
- [0006 – GitHub is the development authority; Sites publishing is a separate handoff](./0006-github-authority-sites-handoff.md)
