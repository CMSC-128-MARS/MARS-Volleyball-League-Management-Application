# MARS Volleyball League Management Application

The MARS Volleyball League Management App is a digital tool that makes running volleyball leagues easier by handling players, creating teams automatically, and tracking match results.

## GitHub Workflow

**Table of Contents**

- [Working with Tickets](#working-with-tickets)
- [Pushing Your Changes](#pushing-your-changes)
- [Branch Behind? Do Rebase!](#branch-behind-do-rebase)
- [Still in Staging Branch?](#still-in-staging-branch)
- [Merge to Staging (For Reviewers)](#merge-to-staging-for-reviewers)

## Working with Tickets
```bash
git fetch origin
git checkout [branch-name]
```

## Pushing Your Changes

*Please refer to [Conventional Commits](https://www.conventionalcommits.org/) for the format of your commit messages*
```bash
git add .
git commit -m "<commit-message>"
git push
```

**Steps:**
1. Create a PR (Pull Request)
2. Move the ticket to "For Review" column
3. In case of errors: `git push origin <branch-name> --force`

## Branch Behind? Do Rebase!

*Do this first before pushing your changes if you are behind!*
```bash
git fetch origin staging

git rebase origin/staging
```

**If you need to stash:**
```bash
git stash 
git fetch origin staging 
git rebase origin/staging 
git stash pop
```


**Fix any merge conflicts that arise during rebase**

## Still in Staging Branch?

**Move to a remote branch:**
```bash
git checkout <branch-name> origin/staging
```

**If you can't move, stash first:**
```bash
git stash
git checkout <branch-name> origin/staging
git stash pop
```

## Merge to Staging (For Reviewers)

1. **Do not** use the default merge button

2. Press the dropdown beside the merge button
3. Click **"Rebase and merge"**

---

**Important Reminders:**
- If you have problems with the workflow, never hesitate to ask questions
- Follow the **1 ticket = 1 branch** rule for easier monitoring and reviews
