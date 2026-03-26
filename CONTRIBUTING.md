# Contributing Guidelines

This document describes the Git workflow and contribution rules for the AirFilterDashboard project.

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Production releases only. Always stable. |
| `dev`  | Integration branch for all features and bugfixes. |

## Branch Naming Conventions

- **Features**: `feature_<task number>` (e.g., `feature_1.2.1`)
- **Bugfixes**: `bugfix_<bug number>` (e.g., `bugfix_42`)
- **Hotfixes**: `hotfix_<bug number>` (e.g., `hotfix_99`)

## Standard Workflow (Features & Bugfixes)

1. **Create branch** from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature_1.2.1
   ```

2. **Implement changes** with clear, atomic commits

3. **Backmerge `dev`** into your branch and resolve conflicts:
   ```bash
   git fetch origin
   git merge origin/dev
   # Resolve any conflicts
   ```

4. **Run tests** and fix any errors:
   ```bash
   python __main__.py run --output build/ --meta-path data/metadata --abund-path data/metagenomic/completed_reports --read-path data/metagenomic
   ```

5. **Push and create PR** targeting `dev`:
   ```bash
   git push -u origin feature_1.2.1
   # Create PR on GitHub
   ```

6. **Squash merge** after PR approval

7. **Delete branch** after merge (GitHub does this automatically if configured)

## Hotfix Workflow

For urgent production bugs that cannot wait for the normal dev cycle:

1. **Create branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix_99
   ```

2. **Implement fix**

3. **Create PR** targeting `main`

4. **After merge to `main`**:
   - Tag the release (e.g., `v2.4.6`)
   - Merge the hotfix into `dev` as well:
     ```bash
     git checkout dev
     git pull origin dev
     git merge origin/main
     git push origin dev
     ```

## Release Process

1. Ensure `dev` is stable and tested
2. Create PR from `dev` to `main`
3. After merge, tag the release:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v2.4.5 -m "Release v2.4.5"
   git push origin v2.4.5
   ```

## Commit Message Convention

Follow this format for clear, consistent commit history:

```
<type>(<scope>): <short description>

[optional body]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks (dependencies, configs, etc.) |

### Examples

```
feat(abundance): add support for multiple taxonomy formats
fix(metadata): handle missing FEMA region codes
docs(readme): update installation instructions
refactor(concurrent): simplify thread pool logic
```

## Branch Protection Rules

The following rules are enforced on GitHub:

### `main` branch
- Require pull request before merging
- Require at least 1 approval
- Require status checks to pass
- No direct pushes

### `dev` branch
- Require pull request before merging
- Require status checks to pass
- No direct pushes

## Quick Reference

| Task | Branch from | Branch name | PR target |
|------|-------------|-------------|-----------|
| New feature | `dev` | `feature_<task>` | `dev` |
| Bug fix | `dev` | `bugfix_<bug>` | `dev` |
| Urgent fix | `main` | `hotfix_<bug>` | `main` (then also merge to `dev`) |
| Release | `dev` | - | `main` |
