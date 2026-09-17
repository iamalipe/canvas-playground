#!/usr/bin/env bash
set -e

# Configuration
RELEASE_BRANCH="${RELEASE_BRANCH:-release}"
BUMP_TYPE="${1:-patch}"

echo "=========================================="
echo "  🚀 Canvas Playground Release Pipeline   "
echo "=========================================="
echo "📌 Bump Type:       $BUMP_TYPE"
echo "🌿 Release Branch:  $RELEASE_BRANCH"
echo ""

# Check for uncommitted changes (excluding untracked files)
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "⚠️  Working directory has uncommitted changes."
  echo "    Please commit or stash your changes before running release."
  exit 1
fi

# 1. Bump version
echo "📦 Incrementing version ($BUMP_TYPE)..."
npm version "$BUMP_TYPE" --no-git-tag-version

# Read new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New Version: v$NEW_VERSION"

# 2. Run lint and tests
echo "🔍 Running linter (oxlint)..."
npm run lint

# 3. Build project
echo "🛠️  Building production bundle (Vite)..."
npm run build

# 4. Prepare GitHub Pages static SPA fallback & CNAME
echo "📄 Preparing GitHub Pages SPA routing fallback..."
cp dist/index.html dist/404.html
touch dist/.nojekyll
if [ -f public/CNAME ]; then
  cp public/CNAME dist/CNAME
fi

# 5. Commit version bump on current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📝 Committing version bump to '$CURRENT_BRANCH'..."
git add package.json package-lock.json
git commit -m "chore(release): bump version to v$NEW_VERSION"

# Tag release
TAG_NAME="v$NEW_VERSION"
echo "🏷️  Creating git tag: $TAG_NAME"
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"

# 6. Deploy to release branch using gh-pages
echo "🚀 Deploying 'dist' bundle to branch '$RELEASE_BRANCH'..."
npx gh-pages -d dist -b "$RELEASE_BRANCH" -m "deploy: release $TAG_NAME [skip ci]" --dotfiles

echo ""
echo "=========================================="
echo "🎉 Successfully released v$NEW_VERSION!"
echo "=========================================="
echo "✅ Bundled files deployed to branch: $RELEASE_BRANCH"
echo "✅ Git tag created: $TAG_NAME"
echo ""
echo "To push current branch and tags to GitHub, run:"
echo "   git push origin $CURRENT_BRANCH --tags"
echo "   git push origin $RELEASE_BRANCH"
echo "=========================================="
