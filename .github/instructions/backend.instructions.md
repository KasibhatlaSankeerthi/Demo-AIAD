---
description: Pipeline for backend/API/service tickets.
---

# Backend Pipeline

## Recognize
API endpoints, services, business logic, background jobs — anything under
the app's server/api/backend directories.

## Plan
List requirements, which modules/endpoints will change, and the ordered
implementation steps. Print as a checklist, then **stop** and ask the user
to `continue` or propose changes. Do not implement before they confirm.

## Implement
Build the change as planned.

## Review
Re-read every changed file against the plan. Check error handling and
input validation at any new boundary.

## Test
1. Create `tests/<TICKET-ID>-test-cases.md` listing every test case:
   `<TICKET-ID>-TC01 | <scenario, e.g. "POST /orders with missing field"> | <expected result>`.
2. Generate a Jest (+ Supertest, if it's an HTTP endpoint) spec file
   `tests/<TICKET-ID>.test.js` implementing every case from that list.
3. Run `npx jest tests/<TICKET-ID>.test.js --colors=false`.
4. Report the literal pass/fail output in chat, one line per test.

## QA Analysis (final chat message)
Same shape as every pipeline (implemented / in-out of scope / files
changed / broken items), plus:
- **Test cases written:** N (see `tests/<TICKET-ID>-test-cases.md`)
- **Test cases passed:** X / N (from the Jest run above)
