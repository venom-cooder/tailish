#!/usr/bin/env bash
#
# Publishes the Tailish static export to AxisIQ Sites, then mirrors the source
# to GitHub.
#
# Two unrelated repositories are involved:
#
#   ~/tailish         → GitHub, public, holds the Next.js source.
#   ~/tailish-deploy  → AxisIQ, holds nothing but the contents of `out/`.
#
# They share no history and no remote. Pushing to GitHub publishes nothing;
# only a push to the AxisIQ repo changes what visitors see.
#
# AxisIQ Sites runs no build step — it serves whatever files are in the repo,
# and every push to main is live immediately. There is no staging deploy to
# inspect and no build log to catch a mistake, so the only place a bad export
# can be stopped is here, before the push.
#
# Usage:
#   npm run deploy
#   npm run deploy -- --dry-run
#   npm run deploy -- --no-github
#   npm run deploy -- "Fix the pricing table"
#
set -euo pipefail

# ----------------------------------------------------------------- settings

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="${TAILISH_DEPLOY_DIR:-$HOME/tailish-deploy}"
OUT_DIR="$SOURCE_DIR/out"

# The deploy remote must look like this. Checked rather than assumed: this
# script's rsync runs with --delete, so pointing it at the wrong repository
# would empty that repository rather than merely add a stray commit.
EXPECTED_REMOTE_FRAGMENT="axisiq.co/git/"
EXPECTED_BRANCH="main"

# A complete export is a few hundred files. Anything far below that means the
# build produced a partial tree, which --delete would then mirror onto the
# live site as a mass deletion.
MIN_EXPORT_FILES=100

DRY_RUN=false
PUSH_GITHUB=true
CUSTOM_MESSAGE=""

# -------------------------------------------------------------------- output

if [[ -t 1 ]]; then
  BOLD=$'\033[1m'; RED=$'\033[31m'; YELLOW=$'\033[33m'
  GREEN=$'\033[32m'; BLUE=$'\033[34m'; RESET=$'\033[0m'
else
  BOLD=""; RED=""; YELLOW=""; GREEN=""; BLUE=""; RESET=""
fi

step()  { printf '\n%s==>%s %s%s%s\n' "$BLUE" "$RESET" "$BOLD" "$1" "$RESET"; }
info()  { printf '    %s\n' "$1"; }
ok()    { printf '    %s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
warn()  { printf '\n%s%s!! %s%s\n' "$BOLD" "$YELLOW" "$1" "$RESET" >&2; }
fail()  { printf '\n%s%sAborted:%s %s\n' "$BOLD" "$RED" "$RESET" "$1" >&2; exit 1; }

# The AxisIQ remote embeds a credential in its URL. This script's output lands
# in terminal scrollback and could be pasted into an issue, so the URL is only
# ever shown with that segment masked.
redact_url() { printf '%s' "$1" | sed -E 's#://[^/@]*@#://***@#'; }

# ---------------------------------------------------------------- arguments

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)   DRY_RUN=true; shift ;;
    --no-github) PUSH_GITHUB=false; shift ;;
    -h|--help)
      # Prints the header block as the help text, so the two can never drift.
      # Stops at the first non-comment line rather than a fixed line number,
      # which would silently start leaking code as the header is edited.
      awk 'NR > 1 { if (/^#/) { sub(/^# ?/, ""); print; next } exit }' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    -*) fail "Unknown flag: $1" ;;
    *)
      [[ -n "$CUSTOM_MESSAGE" ]] && fail "Only one commit message can be given."
      CUSTOM_MESSAGE="$1"; shift
      ;;
  esac
done

command -v rsync >/dev/null 2>&1 || fail "rsync is required but not installed."

# ------------------------------------------------- 1. verify the deploy repo
#
# Every check here exists because step 5 runs --delete. That flag is what keeps
# the live tree an exact mirror of the build — stale files from a previous
# release are removed rather than left to shadow the new ones — but it also
# means this script can delete the entire site in one push. So the target is
# confirmed to be the repository we think it is before anything is written.

step "Checking the deploy repository"

[[ -d "$DEPLOY_DIR" ]] || fail "Deploy directory not found: $DEPLOY_DIR
    Set TAILISH_DEPLOY_DIR if it lives somewhere else."

git -C "$DEPLOY_DIR" rev-parse --git-dir >/dev/null 2>&1 \
  || fail "$DEPLOY_DIR is not a git repository."

deploy_remote="$(git -C "$DEPLOY_DIR" remote get-url origin 2>/dev/null || true)"
[[ -n "$deploy_remote" ]] || fail "$DEPLOY_DIR has no 'origin' remote."

if [[ "$deploy_remote" != *"$EXPECTED_REMOTE_FRAGMENT"* ]]; then
  fail "$DEPLOY_DIR does not point at AxisIQ.
    origin:   $(redact_url "$deploy_remote")
    expected: a URL containing '$EXPECTED_REMOTE_FRAGMENT'
    Refusing to run, because this script mirrors with --delete."
fi

deploy_branch="$(git -C "$DEPLOY_DIR" rev-parse --abbrev-ref HEAD)"
[[ "$deploy_branch" == "$EXPECTED_BRANCH" ]] \
  || fail "Deploy repo is on '$deploy_branch', expected '$EXPECTED_BRANCH'.
    Every push to $EXPECTED_BRANCH is live immediately, so this script only
    ever publishes from that branch."

# A dirty deploy tree means someone edited the live site by hand, or an earlier
# run died midway. Either way those changes would be swept into this release
# without ever having been reviewed.
if [[ -n "$(git -C "$DEPLOY_DIR" status --porcelain)" ]]; then
  fail "Deploy repo has uncommitted changes:
$(git -C "$DEPLOY_DIR" status --short | sed 's/^/      /')
    Commit, stash, or discard them first — otherwise they would ship with
    this release unreviewed."
fi

ok "$DEPLOY_DIR → $(redact_url "$deploy_remote") [$deploy_branch], clean"

# ----------------------------------------------------- 2. identify the source
#
# The deploy repo holds only build artefacts, so its history says nothing about
# what produced them. Recording the source SHA in the deploy commit is the only
# link back from a live file to the code that generated it.

source_sha="$(git -C "$SOURCE_DIR" rev-parse --short HEAD)"
source_branch="$(git -C "$SOURCE_DIR" rev-parse --abbrev-ref HEAD)"
source_dirty=false

if [[ -n "$(git -C "$SOURCE_DIR" status --porcelain)" ]]; then
  source_dirty=true
fi

step "Source"
info "$SOURCE_DIR @ $source_sha ($source_branch)"

# Not fatal: publishing a quick fix before committing it is a legitimate thing
# to do under time pressure. But the resulting deploy commit would name a SHA
# that does not describe what actually shipped, so it has to be said plainly.
if [[ "$source_dirty" == true ]]; then
  warn "Source tree is DIRTY. The published build will include uncommitted
   changes, and the recorded SHA ($source_sha) will not describe it.
   Commit first if you want this release to be reproducible."
  git -C "$SOURCE_DIR" status --short | sed 's/^/      /'
fi

# --------------------------------------------------------- 3. typecheck, build
#
# Ordered deliberately: typecheck first, because it is the faster of the two and
# fails on the class of mistake most likely to reach this script. A failure in
# either stops the run with the previous release still live and untouched.

step "Type checking"
( cd "$SOURCE_DIR" && npm run --silent typecheck ) \
  || fail "Type check failed. Nothing was published."
ok "clean"

step "Building the static export"
( cd "$SOURCE_DIR" && npm run --silent build ) \
  || fail "Build failed. Nothing was published."

# ----------------------------------------------- 4. sanity-check the artefacts
#
# `next build` can exit 0 having written an export that is missing its entry
# point or its asset directory. Since AxisIQ serves these files verbatim, such
# an export is a broken site, and --delete would make it the only thing there.

step "Checking the export"

[[ -d "$OUT_DIR" ]] || fail "No export directory at $OUT_DIR.
    Expected 'npm run build' to produce a static export."

[[ -f "$OUT_DIR/index.html" ]] || fail "$OUT_DIR/index.html is missing.
    Without an entry point the deployed site has no home page."

[[ -d "$OUT_DIR/_next" ]] || fail "$OUT_DIR/_next is missing.
    The export has no JS or CSS assets — the site would render unstyled."

export_files="$(find "$OUT_DIR" -type f | wc -l | tr -d ' ')"
if (( export_files < MIN_EXPORT_FILES )); then
  fail "Export contains only $export_files files, expected at least $MIN_EXPORT_FILES.
    This looks like a partial build. Publishing it would delete most of the
    live site, because the mirror below runs with --delete."
fi

ok "index.html, _next/, $export_files files"

# --------------------------------------------------------------- 5. mirror
#
# --delete is what makes the live tree an exact copy of the build rather than an
# accumulation of every release ever made: a page removed from the site actually
# disappears. The guards in steps 1 and 4 are what make that safe.
#
# --exclude '.git' keeps rsync away from the deploy repo's own history, which
# --delete would otherwise remove.

RSYNC_ARGS=(-a --delete --exclude '.git')

if [[ "$DRY_RUN" == true ]]; then
  step "Dry run — changes that would be published"
  rsync "${RSYNC_ARGS[@]}" --dry-run --itemize-changes "$OUT_DIR/" "$DEPLOY_DIR/" \
    | sed 's/^/    /'
  printf '\n%s%sDry run complete.%s Nothing was copied, committed or pushed.\n' \
    "$BOLD" "$GREEN" "$RESET"
  exit 0
fi

step "Mirroring the export into the deploy repo"
rsync "${RSYNC_ARGS[@]}" "$OUT_DIR/" "$DEPLOY_DIR/"
ok "synced"

# ------------------------------------------------------- 6. anything to do?
#
# Rebuilding identical source usually produces an identical export. Committing
# that would add an empty release to the history and give the impression
# something shipped when nothing did.

if [[ -z "$(git -C "$DEPLOY_DIR" status --porcelain)" ]]; then
  printf '\n%s%sNothing to publish.%s The live site already matches this build.\n' \
    "$BOLD" "$GREEN" "$RESET"
  exit 0
fi

changed="$(git -C "$DEPLOY_DIR" status --porcelain | wc -l | tr -d ' ')"
info "$changed path(s) changed"

# ------------------------------------------------------ 7. publish to AxisIQ

step "Publishing to AxisIQ"

if [[ -n "$CUSTOM_MESSAGE" ]]; then
  commit_subject="$CUSTOM_MESSAGE"
else
  commit_subject="Deploy $source_sha"
fi

# The SHA goes in the body even when a custom subject was given, so the link
# back to the source survives whatever the message says.
commit_body="Source: $source_sha ($source_branch)"
if [[ "$source_dirty" == true ]]; then
  commit_body+=$'\n'"Built from a dirty working tree — contents may differ from $source_sha."
fi

git -C "$DEPLOY_DIR" add -A
git -C "$DEPLOY_DIR" -c core.editor=true commit -q -m "$commit_subject" -m "$commit_body"
git -C "$DEPLOY_DIR" push -q origin "$EXPECTED_BRANCH"

deploy_sha="$(git -C "$DEPLOY_DIR" rev-parse --short HEAD)"
printf '\n%s%sLive.%s AxisIQ %s — %s\n' "$BOLD" "$GREEN" "$RESET" "$deploy_sha" "$commit_subject"

# -------------------------------------------------- 8. mirror source to GitHub
#
# Last on purpose. GitHub holds the source and publishes nothing, so a failure
# here leaves the site live and correct — it only means the public repo is
# behind. That distinction matters when this fails at the end of a long day.

if [[ "$PUSH_GITHUB" == false ]]; then
  info "Skipping GitHub push (--no-github)."
  exit 0
fi

step "Pushing source to GitHub"

# Deliberately not skipped when the tree is dirty. Uncommitted edits and
# committed-but-unpushed commits are independent: a release made from a dirty
# tree can still be sitting on top of commits GitHub has never seen, and
# skipping the push would strand them while reporting success. Push what is
# committed, then say plainly what is still missing.
#
# stderr is left attached so a rejected push shows its reason — "failed, retry
# later" is not actionable when the cause was a non-fast-forward or a dead
# credential.
if git -C "$SOURCE_DIR" push origin "$source_branch"; then
  if [[ "$source_dirty" == true ]]; then
    ok "GitHub updated to $source_sha"
    warn "The live site also contains the uncommitted changes listed above,
   which exist nowhere but this machine. Commit and push to close the gap."
  else
    ok "GitHub updated to $source_sha"
  fi
else
  warn "GitHub push failed.
   THE SITE IS LIVE — this does not affect it. Only the public source repo
   is behind. Re-run 'git push' in $SOURCE_DIR when convenient."
  exit 0
fi
