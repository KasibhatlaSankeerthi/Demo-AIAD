---
description: Pipeline for setup / configuration / tooling / CI-CD tickets.
---

# Setup Pipeline

## Recognize
Environment/config files, CI workflows (`.github/workflows/**`), Dockerfiles,
dependency bumps, repo scaffolding, infra-as-code, README setup steps.

## Plan
List:
- The requirements pulled from the ticket
- Which config/files need to change
- The exact ordered steps to implement

Print it as a checklist, then **stop** and ask the user to `continue` or
propose changes. Do not implement before they confirm.

## Implement
Carry out the (possibly revised) plan.

## Review
Re-read every file you touched against the plan. Check for unrelated
changes, leftover TODOs, or secrets.

## Test
There's no Jest suite for setup tickets. Instead, prove the setup actually
works end to end:
- Run the install/build/bootstrap command(s) the ticket concerns.
- Confirm the exit code and expected output.
- If a script was added, run it once for real.

Report the literal commands you ran and their literal output in chat.

## QA Analysis (final chat message)
- **Implemented:** bullet list
- **In scope / out of scope:** what the ticket asked for vs. what you
  deliberately left out
- **Files created/changed:** list
- **Broken / follow-ups found:** anything discovered but not fixed
- **Validation result:** state which commands were run and whether each
  passed (no automated test count for this pipeline — say
  "N/A — validated via manual command run")
