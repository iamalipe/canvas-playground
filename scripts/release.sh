#!/usr/bin/env bash
set -e

# Configuration
RELEASE_BRANCH="${RELEASE_BRANCH:-release}"
BUMP_TYPE="patch"
AUTO_PUSH=false

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --push)
      AUTO_PUSH=true
      ;;
    patch|minor|major|prepatch|preminor|premajor|prerelease)
      BUMP_TYPE="$arg"
      ;;
    v*|[0-9]*)
      BUMP_TYPE="$arg"
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Usage: npm run release [-- <bump_type>] [--push]"
      echo "Example: npm run release -- minor --push"
      exit 1
      ;;
  esac
done

echo "=========================================="
echo "  🚀 Canvas Playground Release Pipeline   "
echo "=========================================="
echo "📌 Bump Type:       $BUMP_TYPE"
echo "🌿 Release Branch:  $RELEASE_BRANCH"
echo "🔄 Auto Push:       $AUTO_PUSH"
echo ""

# Check for uncommitted changes in current branch
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "⚠️  Working directory has uncommitted changes."
  echo "    Please commit or stash your changes before releasing."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 1. Bump version
echo "📦 Incrementing version ($BUMP_TYPE)..."
npm version "$BUMP_TYPE" --no-git-tag-version

# Read new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")
TAG_NAME="v$NEW_VERSION"
echo "✅ New Version: $TAG_NAME"

# 2. Run lint check
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
echo "📝 Committing version bump to '$CURRENT_BRANCH'..."
git add package.json package-lock.json
git commit -m "chore(release): bump version to $TAG_NAME"

# Tag release on source branch
echo "🏷️  Creating git tag: $TAG_NAME"
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"

# 6. Commit build to release branch using pure git
echo "🚀 Updating release branch '$RELEASE_BRANCH' with production build..."

TEMP_INDEX="/tmp/canvas-git-index-$$"
rm -f "$TEMP_INDEX"
export GIT_INDEX_FILE="$TEMP_INDEX"

# Index all files in dist/
git --work-tree=dist add -A
TREE_ID=$(git write-tree)

rm -f "$TEMP_INDEX"
unset GIT_INDEX_FILE

PARENT_ARGS=()
if git rev-parse --verify "refs/heads/$RELEASE_BRANCH" >/dev/null 2>&1; then
  PARENT_COMMIT=$(git rev-parse "refs/heads/$RELEASE_BRANCH")
  PARENT_ARGS=("-p" "$PARENT_COMMIT")
fi

RELEASE_COMMIT=$(git commit-tree "$TREE_ID" "${PARENT_ARGS[@]}" -m "deploy: release $TAG_NAME [skip ci]")
git update-ref "refs/heads/$RELEASE_BRANCH" "$RELEASE_COMMIT"

echo "✅ Release branch '$RELEASE_BRANCH' updated to commit ${RELEASE_COMMIT:0:8}!"
echo ""
echo "=========================================="
echo "🎉 Successfully released $TAG_NAME!"
echo "=========================================="
echo "  • Version:        $TAG_NAME"
echo "  • Source branch:  $CURRENT_BRANCH"
echo "  • Release branch: $RELEASE_BRANCH"
echo "  • Git tag:        $TAG_NAME"
echo ""

if [ "$AUTO_PUSH" = true ]; then
  echo "📤 Pushing to remote repository..."
  git push origin "$CURRENT_BRANCH" --tags
  git push origin "$RELEASE_BRANCH"
  echo "✅ Push complete!"
else
  echo "👉 To push to GitHub, run:"
  echo "   git push origin $CURRENT_BRANCH --tags"
  echo "   git push origin $RELEASE_BRANCH"
fi
echo "=========================================="
