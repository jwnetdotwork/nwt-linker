#!/bin/bash

# Exit on error
set -e

# Load .env file
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Pre-checks
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Error: Must be on 'main' branch to release (current: $CURRENT_BRANCH)"
  exit 1
fi

if [ -z "$NWT_LINKER_VERSION" ]; then
  echo "Error: NWT_LINKER_VERSION is not defined in .env"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working tree is dirty. Please commit or stash changes before releasing."
  exit 1
fi

echo "Releasing version $NWT_LINKER_VERSION..."

# Update version, commit, and tag
npm version "$NWT_LINKER_VERSION" --tag-version-prefix ''

# Push to origin
git push origin HEAD --follow-tags

echo "Successfully released and pushed version $NWT_LINKER_VERSION"
