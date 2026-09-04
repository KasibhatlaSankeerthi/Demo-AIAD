---
mode: agent
description: Open a GitHub PR for a resolved ticket, using the repo's single PR template, then move the ticket to In Review.
tools: ['githubRepo', 'codebase', 'search', 'atlassian']
---

Ticket: `${input:ticketId:e.g. DE-123}`

Repo: `Demo-AIAD`. Jira project: `DE`.

1. Print a status block: `AGENT: PR Publisher`, `TICKET: <id>`,
   `STAGE: Raise PR`.
2. From this conversation, gather: the ticket summary, what was implemented,
   what was in/out of scope, and the list of files created/changed (you
   already produced all of this in the QA Analysis — reuse it verbatim,
   don't re-derive it).
3. Read `.github/PULL_REQUEST_TEMPLATE.md` and fill it in:
   - Ticket link, "What was implemented", "Type of change" checkbox,
     "Scope" section — all filled in from what you know.
   - **Leave the entire Testing section exactly as the blank template has
     it** — the `- [ ] Testing was done on this change` checkbox unchecked,
     and `Test cases passed: ___ / ___` untouched. Do not fill these in
     even though you know the pass rate from the earlier test run — that
     line is filled in by hand by whoever reviewed the chat output.
4. Use the GitHub MCP tools to open the PR against the current branch in
   `Demo-AIAD`, with that filled-in template as the PR body.
5. Print the status block again with `STAGE: Update ticket status`.
6. Use the Atlassian MCP transition tool to move `${input:ticketId}` from
   its current status to **`In Review`**.
   - **Never transition it to `Done`.** `Done` is a manual step a person
     does after the PR is actually reviewed and merged — this prompt is
     only ever allowed to move a ticket as far as `In Review`.
   - If the ticket is already past `In Review` (e.g. someone already moved
     it), don't move it backward — just report its current status as-is.
7. Report back: the PR URL, and the ticket's new status (`In Review`).
   Remind the user to fill in the Testing checklist on the PR by hand
   before merging, and that they'll need to move the ticket to `Done`
   themselves once it's merged.
