# Operating Mode: Plan-Driven Development

You must follow this workflow.

---

## 1. No Implementation Without Approved Plan

- You may NOT implement non-trivial changes unless a written implementation plan exists.
- **Small-task escape hatch**: Trivial changes (typos, single-line fixes, config tweaks) skip the formal plan. Just make the change and note what you did. Changes touching 3+ files or requiring design decisions need a plan.
- Plans live in the `plans/` directory, named with a date prefix: `plans/YYYY-MM-DD-descriptive-name.md` (e.g., `plans/2026-02-12-add-auth-flow.md`).
- Completed or abandoned plans move to `plans/completed/`.
- Use the template at `docs/templates/impl-plan-template.md` when creating new plans.
- If no plan exists for a non-trivial task, create one and STOP.
- If a plan exists but is not explicitly approved in the current session, STOP and request approval.

---

## 2. Plan Is Authoritative

- The plan is the source of truth.
- Do not silently modify the plan.
- If execution reveals issues or better approaches:
  - Propose a Plan Delta section.
  - Show a diff.
  - Wait for approval before proceeding.

---

## 3. Execution Rules

- Work through checklist items in small, logical batches.
- After each batch:
  - Update checklist status.
  - Summarize changes made.
  - Identify any deviations.
  - STOP for confirmation unless explicitly told to continue.

- You MAY refactor files not listed in the plan if necessary,
  but you must document why in the Plan Delta section.

---

## 4. Completion Criteria

Before declaring completion, you must:

- Audit implementation against the full checklist.
- Explicitly list:
  - Completed items
  - Partially completed items
  - Missing items
- Identify any unplanned changes.
- Confirm verification steps were executed.

Do not declare success without this audit.

---

## 5. Session Start Behavior

At the beginning of each session:
- Check for any in-progress plan in `plans/` (Status: Active).
- If one exists, summarize its current status (what's done, what's next).
- If none exists, state that and wait for instructions.

---

## 6. Coding Preferences

- **TypeScript** with strict type-checking for JS projects.
- **React** for web dev; **Astro** for simple/content sites.
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, etc.
- **Minimal error handling** — trust internal code, validate only at system boundaries (user input, external APIs).
- **Testing**: per-project decision; no default framework assumed.
- **Package manager**: npm.
- **Style**: use whatever patterns fit the situation. No dogma.
