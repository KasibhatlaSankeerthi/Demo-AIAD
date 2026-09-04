---
description: Pipeline for database/schema/migration tickets.
---

# Database Pipeline

## Recognize
Schema changes, migrations, models, seed data, queries — anything under the
app's `db/`/`migrations/`/`models` directories.

## Plan
List requirements, which schema objects/migrations will change, and the
ordered implementation steps. Print as a checklist, then **stop** and ask
the user to `continue` or propose changes. Do not implement before they
confirm.

## Implement
Write the migration and any model/query changes as planned.

## Review
Re-read every changed file against the plan. Confirm the migration has a
working down/rollback path.

## Test
1. Create `tests/<TICKET-ID>-test-cases.md` listing every test case:
   `<TICKET-ID>-TC01 | <scenario, e.g. "migrate up creates column X"> | <expected result>`.
2. If there's a query/repository layer to exercise, generate a Jest spec
   `tests/<TICKET-ID>.test.js` implementing those cases and run
   `npx jest tests/<TICKET-ID>.test.js --colors=false`.
3. Always additionally validate the migration itself for real:
   run migrate **up**, verify the resulting schema, run migrate **down**,
   verify it reverts cleanly.

Report the literal commands/output for both the migration run and any Jest
run.

## QA Analysis (final chat message)
Same shape as every pipeline (implemented / in-out of scope / files
changed / broken items), plus:
- **Test cases written:** N
- **Test cases passed:** X / N (Jest, if applicable — otherwise
  "N/A, validated via migrate up/down" )
- **Migration validation:** up = pass/fail, down = pass/fail
