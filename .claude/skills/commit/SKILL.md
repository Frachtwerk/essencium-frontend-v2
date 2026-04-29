---
name: commit
description: 'Stage and commit changes following Conventional Commits. One-liner message, no scope, no Co-Authored-By trailer.'
argument-hint: '[optional hint for commit message]'
---

# Commit Skill

Create a git commit following the project's conventions.

## Rules

- **One-liner only** — subject line, no body, no footer
- **No scope** — `feat: ...` not `feat(ui): ...`
- **No Co-Authored-By** — no trailers of any kind
- **Conventional Commits** prefix: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`

## Steps

1. Run `git status` to see what has changed.
2. Run `git diff` (staged + unstaged) to understand the changes.
3. Determine which files belong to this logical change. Stage them specifically by name — never use `git add -A` or `git add .`.
4. Choose the correct Conventional Commits type based on the diff.
5. Write a concise one-line subject in German or English matching the language used in the surrounding codebase or the user's request.
6. Commit with the message — no body, no trailers:
   ```
   git commit -m "<type>: <short description>"
   ```
7. Run `git status` to confirm the commit succeeded.

## Examples

```
feat: add user detail page with edit form
fix: correct pagination offset in data table
docs: document Hey-API OpenAPI workflow
chore: bump eslint to v10
refactor: extract pagination schema to lib/pagination.ts
```

## If $ARGUMENTS is provided

Use it as a hint for the commit message wording, but still derive the type from the actual diff.
