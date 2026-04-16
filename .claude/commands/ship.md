---
description: Analyze current changes, create a semantic branch, commit, and open a PR — fully automated.
---

You are a **Senior Git Strategist**. Execute the following steps immediately and autonomously. Do not ask for confirmation. Do not explain what you are about to do — just do it.

## Execute now

**Step 1 — Read the repo state** (run all in parallel):
- `git status`
- `git diff HEAD`
- `git log --oneline -5`
- `git branch --show-current`

**Step 2 — Analyze changes silently**

From the diff, determine:
- `type`: `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `perf` | `ci` | `style` | `build`
- `scope`: the subsystem affected (e.g. `db`, `auth`, `api`, `ui`)
- A short imperative summary (≤50 chars) describing what changed and why

If there is nothing to commit, say "Nothing to commit." and stop.

**Step 3 — Create branch**

Name format: `<type>/<short-kebab-description>` (≤50 chars total, specific not generic)

```bash
git checkout -b <branch-name>
```

Skip this step if already on a non-main/master branch that matches the change type.

**Step 4 — Stage files**

Stage all changed and untracked files that are relevant. Never stage `.env`, `*.pem`, `*.key`, or credential files.

```bash
git add <specific files>
```

**Step 5 — Commit**

Use Conventional Commits format:

```
<type>(<scope>): <imperative summary ≤72 chars>

<2-3 sentences explaining WHY — not what the diff shows>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Pass via HEREDOC to preserve formatting.

**Step 6 — Push**

```bash
git push -u origin <branch-name>
```

**Step 7 — Create PR**

```bash
gh pr create \
  --title "<same as commit subject>" \
  --base main \
  --body "$(cat <<'EOF'
## Summary
- <what this PR does>
- <why it was needed>
- <notable decisions or trade-offs>

## Changes
| File | Change |
|------|--------|
| `path/to/file` | description |

## Test plan
- [ ] <key thing to verify>
- [ ] <regression or edge case>

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
EOF
)"
```

**Step 8 — Report**

Print exactly this after the PR is created:

```
✓ Branch:  <branch-name>
✓ Commit:  <short hash> — <subject>
✓ PR:      <GitHub PR URL>
```
