# MyReactChat agent guide

## Mission

Maintain the React/Express chat application safely, with small changes and proportionate verification.

## Start here

1. Read this file.
2. Read only the nested `AGENTS.md` for the area you will change:
   - `client/AGENTS.md` for browser/UI work.
   - `server/AGENTS.md` for API, database, auth, or Socket.IO work.
3. Read `docs/agent-context/architecture.md` only when the task crosses boundaries or the relevant flow is unclear.
4. Inspect the actual code before trusting documentation; update durable context when architecture or commands change.

Do not load every context file by default.

## Task flow

1. Classify the request: frontend, backend, realtime, security, or cross-cutting.
2. Inspect the smallest relevant file set and current Git diff.
3. State assumptions only when they materially affect behavior.
4. Implement the smallest complete fix.
5. Verify with the commands for the changed area.
6. For a significant change, review `README.md` and update it in the same task when user-facing behavior, setup, environment variables, commands, architecture, or deployment changed.
7. Run the context freshness gate below before considering the task complete.
8. Report the outcome, verification, documentation updates, and any remaining risk.

## Context freshness gate

Durable project context must be updated in the same change that makes it stale. Before finishing any code task, compare the final diff with the context map below. A change is significant when it adds or changes a cross-file flow, invariant, integration, authorization rule, runtime dependency, deployment boundary, environment variable, public command, or user-visible capability.

| Change | Required context update |
| --- | --- |
| Runtime flow, component/service responsibility, REST/Socket protocol, data ownership, or deployment boundary | `docs/agent-context/architecture.md` |
| Long-lived technical choice or non-obvious constraint that future work must preserve | `docs/agent-context/decisions.md` |
| Setup, command, environment variable, feature, deployment, or operational behavior | `README.md` |
| Frontend-specific invariant, important path, or verification command | `client/AGENTS.md` |
| Backend-specific invariant, important path, or verification command | `server/AGENTS.md` |

Rules:

- Update only documents affected by the final diff; do not rewrite context mechanically.
- Record the resulting architecture and constraints, not a chronological work log.
- Remove or correct stale context instead of appending contradictory guidance.
- Keep secrets, credentials, incident details, temporary debugging notes, and speculative plans out of durable context.
- If no durable context changed, state that explicitly in the final report.
- A significant change is not complete while its required context update is missing.

For a large request that splits into independent lanes, specialists may investigate frontend, backend, realtime, and tests in parallel. Keep one owner for integration and final verification. Do not delegate small or tightly coupled work.

## Project-wide rules

- The codebase is TypeScript. React files use `.tsx`; other source files use `.ts`.
- Never expose or commit `.env`, tokens, database URLs, or JWT secrets.
- Preserve REST paths and Socket.IO event names unless the task explicitly changes the protocol.
- Enforce authorization on the server even when the UI hides an action.
- Prefer functional React state updates in asynchronous listeners.
- Clean up timers and event listeners in React effects.
- Preserve user changes and avoid editing generated `dist/` or `client/build/` output.
- Keep `README.md` current after significant changes. Do not update it for internal refactors that do not affect behavior, setup, architecture, commands, or operations.

## Commands

- Backend type check: `npm run typecheck`
- Backend build: `npm run build`
- Backend development: `npm run dev`
- Frontend type check: `cd client && npx tsc --noEmit`
- Frontend build: `cd client && npm run build`

Run both type checks and both builds for cross-cutting changes.

## Authority

For review, explanation, or diagnosis, inspect and report without changing code. For build, change, or fix requests, make in-scope local edits and run non-destructive checks. Ask before destructive actions, external writes/deployments, purchases, or meaningful scope expansion.
