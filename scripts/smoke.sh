#!/usr/bin/env bash
set -euo pipefail

echo "Running smoke tests against $PANEL_URL and $API_URL"

if [ -z "${PANEL_URL-}" ] || [ -z "${API_URL-}" ]; then
  echo "PANEL_URL or API_URL not set. Make sure secrets are configured."
  exit 2
fi

echo 'Checking API /health'
curl --fail --silent --show-error "$API_URL/health" | jq .

echo 'Checking Panel home'
curl --fail --silent --show-error "$PANEL_URL/" | head -c 200

echo 'Smoke tests passed.'
