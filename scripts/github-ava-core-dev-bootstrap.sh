#!/usr/bin/env bash
# Bootstrap Ava-Core-Dev remotes. Requires: gh auth as Ava-Core-Dev (GH_TOKEN).
set -euo pipefail
ORG="${AVA_GITHUB_OWNER:-Ava-Core-Dev}"
if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Run: gh auth login -h github.com  (use Ava-Core-Dev PAT)"
  exit 1
fi
WHO=$(gh api user --jq .login)
echo "Authenticated as: $WHO (want $ORG)"
create_and_push() {
  local name="$1"
  local dir="$2"
  local vis="${3:-private}"
  if [[ ! -d "$dir" ]]; then
    echo "skip missing $dir"
    return 0
  fi
  echo "=== $name ← $dir ==="
  if [[ ! -d "$dir/.git" ]]; then
    git -C "$dir" init
    git -C "$dir" add -A || true
    git -C "$dir" commit -m "Initial import for Ava-Core-Dev" || true
  fi
  if ! gh repo view "$ORG/$name" >/dev/null 2>&1; then
    gh repo create "$ORG/$name" --"$vis" --description "Ava / Root Record Ecosystem — $name" --confirm || \
      gh repo create "$ORG/$name" --"$vis" --description "Ava / Root Record Ecosystem — $name"
  fi
  git -C "$dir" remote remove ava-core-dev 2>/dev/null || true
  git -C "$dir" remote add ava-core-dev "https://github.com/$ORG/$name.git" 2>/dev/null || \
    git -C "$dir" remote set-url ava-core-dev "https://github.com/$ORG/$name.git"
  # Do not force-push; first push sets main if empty
  git -C "$dir" push -u ava-core-dev HEAD:main || git -C "$dir" push -u ava-core-dev HEAD:master || true
}
create_and_push "rootrecord-ava" "/home/ava-core/ava/workstations/projects/rootrecord-ava" private
create_and_push "rootrecord-merged" "/home/ava-core/ava/workstations/projects/rootrecord-merged" private
create_and_push "ava-core-runtime" "/home/ava-core/ava/core" private
echo "Done. Review https://github.com/$ORG"
echo "Next: add remaining workers from docs/GITHUB-AVA-CORE-DEV.md"
