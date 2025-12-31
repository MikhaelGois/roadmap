Param(
  [string]$Message = 'chore: publish demo to gh-pages'
)

Write-Host "Staging changes..."
git add -A

$staged = git diff --cached --name-only
if (-not $staged) {
  Write-Host "No changes to commit. Nothing to do."
  exit 0
}

Write-Host "Committing: $Message"
git commit -m "$Message"

Write-Host "Pushing to origin main..."
git push origin main

Write-Host "Push complete. The GH Pages workflow should start automatically. Check Actions in GitHub to follow progress."