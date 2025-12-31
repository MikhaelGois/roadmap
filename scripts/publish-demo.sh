#!/usr/bin/env bash
set -euo pipefail

# Convenience script to commit & push the demo changes and trigger GH Pages workflow
# Usage: ./scripts/publish-demo.sh "Your commit message"

MSG=${1:-"chore: publish demo to gh-pages"}

echo "Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "No changes to commit. Nothing to do."
  exit 0
fi

echo "Committing: $MSG"
git commit -m "$MSG"

echo "Pushing to origin main..."
git push origin main

echo "Push complete. The GH Pages workflow should start automatically. Check Actions in GitHub to follow progress."