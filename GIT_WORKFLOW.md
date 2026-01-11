# Git Branch Strategy

## Branches

```
main (production)
  ↑
staging (pre-production)
  ↑
development (active development)
  ↑
feature/* (feature branches)
```

## Setup Branches

```bash
# Create and push all branches
git checkout -b development
git push -u origin development

git checkout -b staging
git push -u origin staging

git checkout -b main
git push -u origin main

# Set default branch to development
git checkout development
```

## Workflow

### 1. Feature Development
```bash
# Start new feature
git checkout development
git pull origin development
git checkout -b feature/user-authentication

# Make changes, commit
git add .
git commit -m "feat: add user authentication"
git push origin feature/user-authentication

# Create PR to development on GitHub
# After review, merge to development
# Delete feature branch
```

### 2. Deploy to Staging
```bash
# Merge development to staging
git checkout staging
git pull origin staging
git merge development
git push origin staging

# This automatically deploys to:
# - Backend: vasukriti-backend-staging.onrender.com
# - Frontend: staging.vasukritijewels.com
```

### 3. Deploy to Production
```bash
# After testing on staging
git checkout main
git pull origin main
git merge staging
git push origin main

# This automatically deploys to:
# - Backend: vasukriti-backend-prod.onrender.com
# - Frontend: vasukritijewels.com
```

## Branch Protection Rules (GitHub)

### For `main` branch:
- Require pull request reviews (1 approval)
- Require status checks to pass
- Require branches to be up to date
- No direct pushes

### For `staging` branch:
- Require pull request from development
- Optional review
- Status checks pass

### For `development` branch:
- Direct pushes allowed
- Feature branches merge here

## Commit Message Convention

Follow conventional commits:
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

Examples:
```bash
git commit -m "feat: add email verification"
git commit -m "fix: resolve cart calculation bug"
git commit -m "docs: update deployment guide"
```
