---
mode: agent
description: Resolve a Jira ticket end-to-end — classify it, then run the matching pipeline (plan → confirm → implement → review → test → QA report).
tools: ['atlassian', 'githubRepo', 'codebase', 'search', 'edit', 'runCommands', 'runTests']
---

Ticket to resolve: `${input:ticketId:e.g. DE-123}`

Follow `.github/copilot-instructions.md` for the status-block format, the
project configuration (Jira project `DE`, Confluence space `Demo`, repo
`Demo-AIAD`), and the plan → confirm → implement → review → test →
QA-analysis contract. Do not skip the confirmation gate.

## Stage: Classify

1. Print the status block with `STAGE: Classify`.
2. Fetch the ticket (`${input:ticketId}`) via the Atlassian MCP tools —
   summary, description, labels, components, issue type. It must belong to
   the `DE` project — if the ID doesn't match that project, say so and stop.
3. If the description links any Confluence pages, fetch them too (scoped to
   the `Demo` space) and list them in the `REFERENCING` line.
4. Decide which pipeline applies:
   - **Setup** → env/config/CI/tooling/scaffolding
   - **Frontend** → UI/components/pages/client state
   - **Backend** → API/services/business logic
   - **Database** → schema/migrations/models/queries

   Use labels/components first, then keyword-match the summary/description.

5. **If it's genuinely ambiguous or ties between two types, stop and ask the
   user directly which pipeline to run.** Never guess silently.

6. Once decided, say so plainly, e.g.:
   `✅ Classified as **Backend**. Continuing with the Backend Pipeline.`

## Stage: run the matching pipeline

Open and follow, in full, the instructions file for the classification you
landed on — this is the single source of truth for that ticket type, so
follow it exactly (including its own Test and QA Analysis sections):

- Setup → [.github/instructions/setup.instructions.md](../instructions/setup.instructions.md)
- Frontend → [.github/instructions/frontend.instructions.md](../instructions/frontend.instructions.md)
- Backend → [.github/instructions/backend.instructions.md](../instructions/backend.instructions.md)
- Database → [.github/instructions/database.instructions.md](../instructions/database.instructions.md)

Print the status block again at the start of every stage that file defines
(Plan, Implement, Review, Test, QA Analysis), with `AGENT` set to the
matching pipeline name.

## When this prompt finishes

End your final QA Analysis message with:

> When you've reviewed the changes, say **"raise a PR for `${input:ticketId}`"** to open the pull request.
