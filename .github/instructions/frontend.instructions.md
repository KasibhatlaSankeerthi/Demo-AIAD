---
description: Pipeline for frontend/UI tickets.
---

# Frontend Pipeline

## Recognize
UI components, pages, styling, client-side state, anything under the app's
frontend/client/components directories.

## Plan
List requirements, which components/files will change, and the ordered
implementation steps. Print as a checklist, then **stop** and ask the user
to `continue` or propose changes. Do not implement before they confirm.

## Implement
Build the change as planned.

## Review
Re-read every changed file against the plan.

## Test
1. Create `tests/<TICKET-ID>-test-cases.md` listing every test case:
   `<TICKET-ID>-TC01 | <scenario> | <expected result>` (one row per case).
2. Generate a Jest (+ Testing Library, if components render) spec file
   `tests/<TICKET-ID>.test.jsx` that implements every case from that list —
   same IDs, same order.
3. Run `npx jest tests/<TICKET-ID>.test.jsx --colors=false`.
4. Report the literal pass/fail output in chat, one line per test.

## QA Analysis (final chat message)
Same shape as every pipeline (implemented / in-out of scope / files
changed / broken items), plus:
- **Test cases written:** N (see `tests/<TICKET-ID>-test-cases.md`)
- **Test cases passed:** X / N (from the Jest run above)
