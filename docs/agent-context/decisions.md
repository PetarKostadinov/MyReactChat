# Durable decisions

Record only decisions that future tasks need. Do not use this as a work log.

- 2026-08-09: Source code is TypeScript; backend compilation and frontend CRA builds use separate TypeScript configurations.
- 2026-08-09: HTTP and Socket.IO use the same JWT identity.
- 2026-08-09: Authorization is enforced server-side for chat membership and group administration.
- 2026-08-09: Repository context is layered through root and nested `AGENTS.md` files to avoid loading unrelated details.
- 2026-08-10: Significant changes must update affected durable context in the same task; context records current architecture and constraints rather than chronological implementation history.
- 2026-08-11: Deployment is gated by backend and frontend tests; reusable authorization predicates live outside controllers so production rules can be tested deterministically without an external database.
