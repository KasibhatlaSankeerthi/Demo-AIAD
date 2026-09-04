# Repo-wide Copilot rules

This repo drives ticket work through a Copilot Chat pipeline: **prompts** (slash
commands you type), **agents** (the visible persona for each ticket type,
`.github/agents/*.agent.md`), and **instructions** (the shared logic every
pipeline follows). Read `README-ticket-workflow.md` once for the full picture.

## Project configuration

- **Atlassian site:** `sankeerthitao.atlassian.net` — **cloud ID:** `20e226bd-29e4-40e5-9592-f08bf848ac6a`. Pass this `cloudId` directly to Atlassian MCP calls instead of re-resolving it each session.
- **Jira project key:** `DE` (all tickets are `DE-###`, e.g. `DE-123`) — scope every Jira search/fetch to this project.
- **Confluence space key:** `Demo` — scope every Confluence search/fetch to this space.
- **GitHub repo:** `Demo-AIAD` — this is where every PR gets raised. <!-- confirm exact owner/repo slug -->
- **Jira workflow stages:** `To Do` → `In Progress` → `In Review` → `Done`.

## The pipeline contract (every ticket type follows this)

Every pipeline — Setup, Frontend, Backend, Database — moves through the same
five stages, in order, and **never skips the gate**:

1. **Plan** — list requirements pulled from the ticket + the exact ordered
   steps you intend to take.
2. **STOP.** Ask the user to reply `continue`, or to describe changes to the
   plan. Do not implement anything until they confirm.
3. **Implement** — carry out the (possibly revised) plan.
4. **Review** — re-read every changed file against the plan.
5. **Test** — see the ticket-type instructions file for how ("run the setup
   end to end" vs. "write and run a Jest suite").
6. **QA Analysis** — a final chat message with: what was implemented, what
   was in/out of scope, what files were created or changed, anything found
   broken, and the pass rate.

## Always show your work in chat

Before each stage, print a short status block so it's obvious what's running
and what it's looking at:

```
🧭 AGENT:      <Setup|Frontend|Backend|Database> Pipeline
🎫 TICKET:     <TICKET-ID> — <one-line summary>
📎 REFERENCING: <Jira issue link>, <Confluence pages, if any>, <repo files being read/changed>
🔷 STAGE:      Classify | Plan | Implement | Review | Test | QA Analysis
```

## Classifying a ticket

Frontend / Backend / Setup / Database — decide from the Jira issue's labels,
components, and description first; fall back to keyword matching. **If it's
genuinely ambiguous, ask the user which pipeline to run.** Never guess
silently.

## Tests

Test case files live at `tests/<TICKET-ID>-test-cases.md` (the human-readable
list) and `tests/<TICKET-ID>.test.*` (the runnable Jest spec). Always report
the literal test framework output in chat, not a paraphrase.

## Pull requests

Only open a PR when the user explicitly asks (e.g. "raise a PR for
DE-123"). Always use `.github/PULL_REQUEST_TEMPLATE.md` verbatim — fill in
everything you know (ticket ID, what was implemented, files changed), but
**leave the Testing checklist checkbox and the `___ / ___ test cases passed`
blank**. That section is filled in by hand by the person who reviewed the run
in chat — never guess or auto-fill it, even though you know the number from
the test run.

## Ticket status transitions

Once a PR is opened for a ticket, transition its Jira status to **`In
Review`** — that's the only status change this workflow ever makes
automatically.

**Never transition a ticket to `Done`.** `Done` is set by hand, by a person,
after the PR is actually reviewed and merged — it is never something the
pipeline decides on its own.
