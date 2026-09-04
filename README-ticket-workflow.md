# Ticket-Resolver Copilot Workflow

A ticket-driven pipeline for GitHub Copilot Chat, wired to Jira/Confluence
(Atlassian MCP) and GitHub (GitHub MCP). One slash command takes a ticket ID
all the way to a QA-reviewed, PR-ready change.

**Project configuration:** Atlassian site `sankeerthitao.atlassian.net`
(cloud ID `20e226bd-29e4-40e5-9592-f08bf848ac6a`) · Jira project `DE` ·
Confluence space `Demo` · GitHub repo `Demo-AIAD`.

## Files

| Piece | What it is | Where |
|---|---|---|
| Instructions | The brain — one file per ticket type, defines plan/test/QA for that type | `.github/instructions/*.instructions.md` |
| Prompts | Slash commands you type in chat, with a ticket ID as input | `.github/prompts/*.prompt.md` |
| Agents | The named personas — same brain, selectable from the mode dropdown | `.github/agents/*.agent.md` |
| PR template | The one PR format every raised PR uses | `.github/PULL_REQUEST_TEMPLATE.md` |
| Repo rules | Status-block format + the plan→confirm→implement→review→test→QA contract | `.github/copilot-instructions.md` |

## One-time setup

1. Open this folder in VS Code with GitHub Copilot Chat.
2. `.vscode/mcp.json` already points at the GitHub and Atlassian MCP servers
   — start them from the "MCP Servers" panel and sign in when prompted.
   (Double-check those URLs against your org's current Atlassian/GitHub MCP
   docs — hosted endpoints do change.)
3. Confirm **agent mode** is enabled in Copilot Chat.

## Demo script

**1. Resolve a ticket**

```
/ticket-resolver DE-123
```

What happens, visibly, in chat:
- A status block shows which agent is running, the ticket, and exactly what
  it's referencing (Jira link, Confluence pages, files).
- It classifies the ticket as Setup / Frontend / Backend / Database. If it
  can't tell, **it asks you** instead of guessing.
- It prints a plan (requirements + steps) and **stops**.

**2. You confirm**

```
continue
```
(or describe changes — it revises the plan and stops again before touching
any code)

**3. It runs the rest of the pipeline unattended**

- Implements the plan.
- Reviews its own diff.
- Tests it:
  - **Setup** tickets → runs the actual install/build/bootstrap commands.
  - **Frontend/Backend** tickets → writes `tests/DE-123-test-cases.md`,
    generates a Jest spec `tests/DE-123.test.js`, runs it, reports the raw
    pass/fail output.
  - **Database** tickets → runs migrate up/down, plus Jest if there's a
    query layer to exercise.
- Ends with a QA Analysis: implemented / in-scope vs. out-of-scope / files
  touched / anything broken / pass rate.

**4. You review the diff and test output, then ask for the PR**

```
raise a PR for DE-123
```

- Opens the PR using `.github/PULL_REQUEST_TEMPLATE.md`, filled in except
  for the Testing checklist — you tick that box and fill in
  `___ / ___ test cases passed` yourself, from the numbers you already saw
  in chat.
- Moves the Jira ticket from its current status to **`In Review`**. It never
  moves a ticket to `Done` — that's set by hand once the PR is actually
  merged.

## Alternative entry point: agents

Instead of `/ticket-resolver`, you can pick **Frontend Pipeline** (etc.)
directly from the Copilot Chat mode dropdown and just describe the ticket —
same plan→confirm→implement→review→test→QA behavior, useful when you
already know the ticket type and want to skip classification.

## Extending it

Add a new ticket type by adding one instructions file, one agent, and
pointing `ticket-resolver.prompt.md`'s classification rubric at it — the
prompt and PR flow don't change.
