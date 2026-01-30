# GitHub Repository Setup Instructions

## Create the GitHub Repository

1. **Go to GitHub**: Navigate to [https://github.com/new](https://github.com/new)

2. **Repository Details**:
   - **Owner**: `billlegrand-lab` (or your preferred account)
   - **Repository name**: `tripbeast-discount-rules`
   - **Description**: "Automated testing framework for TripBeast discount rules using Playwright"
   - **Visibility**: Choose Public or Private based on your needs
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. **Click "Create repository"**

## Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in PowerShell from the `Tripbeast Discount Rules` directory:

```powershell
# Add the remote repository
git remote add origin https://github.com/billlegrand-lab/tripbeast-discount-rules.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin master
```

## Alternative: Using SSH (if you have SSH keys set up)

```powershell
# Add the remote repository using SSH
git remote add origin git@github.com:billlegrand-lab/tripbeast-discount-rules.git

# Push your code to GitHub
git push -u origin master
```

## Verify

After pushing, visit your repository at:
`https://github.com/billlegrand-lab/tripbeast-discount-rules`

You should see all 39 files from your initial commit.

## Next Steps

- Add repository topics/tags on GitHub (e.g., "playwright", "testing", "typescript")
- Consider adding branch protection rules if working with a team
- Set up GitHub Actions for CI/CD if needed
