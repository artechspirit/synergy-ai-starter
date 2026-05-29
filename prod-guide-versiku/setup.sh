#!/usr/bin/env bash
set -euo pipefail

MODE="blueprint"
OUTPUT_ROOT="prod-guide-versiku/generated"
PROJECT_SLUG=""

usage() {
  cat <<'USAGE'
Usage:
  ./prod-guide-versiku/setup.sh [--intake] [--output <dir>] [--name <project-slug>]

Examples:
  ./prod-guide-versiku/setup.sh --intake --name luxtrace
  ./prod-guide-versiku/setup.sh --output docs/blueprints --name ops-dashboard

Outputs:
  --intake mode:
    <output>/<project-slug>/PROJECT_INTAKE.md
    <output>/<project-slug>/PROMPT_TO_BLUEPRINT.md

  default mode:
    <output>/<project-slug>/PROJECT_BLUEPRINT.md
    <output>/<project-slug>/ROADMAP.md
    <output>/<project-slug>/PROMPT_TO_FEATURE_SPECS.md
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --intake)
      MODE="intake"
      shift
      ;;
    --output)
      OUTPUT_ROOT="${2:-}"
      shift 2
      ;;
    --name)
      PROJECT_SLUG="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$OUTPUT_ROOT" ]]; then
  echo "--output cannot be empty" >&2
  exit 1
fi

if [[ -z "$PROJECT_SLUG" ]]; then
  printf "Project slug: "
  read -r PROJECT_SLUG
fi

if [[ -z "$PROJECT_SLUG" ]]; then
  echo "Project slug is required" >&2
  exit 1
fi

PROJECT_SLUG="$(printf '%s' "$PROJECT_SLUG" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//')"
TARGET_DIR="$OUTPUT_ROOT/$PROJECT_SLUG"
mkdir -p "$TARGET_DIR"

if [[ "$MODE" == "intake" ]]; then
  cp prod-guide-versiku/AI_PROJECT_INTAKE_TEMPLATE.md "$TARGET_DIR/PROJECT_INTAKE.md"
  cat > "$TARGET_DIR/PROMPT_TO_BLUEPRINT.md" <<'PROMPT'
Tolong baca `PROJECT_INTAKE.md`.
Ubah intake awam itu menjadi `PROJECT_BLUEPRINT.md` yang mengikuti `prod-guide-versiku/AI_PROJECT_BLUEPRINT_TEMPLATE.md`.
Lalu generate `ROADMAP.md` yang mengikuti `prod-guide-versiku/AI_RULES_ROADMAP.md`, `prod-guide-versiku/AI_RULES_MATURITY.md`, dan `prod-guide-versiku/AI_RULES_PRODUCTION_READY.md`.

PENTING:
- Jangan coding dulu.
- Kalau ada informasi kurang, maksimal tanya 5 pertanyaan klarifikasi paling penting.
- Kalau bisa diinfer dengan aman, lanjutkan dan tandai sebagai Assumption.
- Jika repo existing belum sesuai target architecture, buat migration gate dulu.
PROMPT
else
  cp prod-guide-versiku/AI_PROJECT_BLUEPRINT_TEMPLATE.md "$TARGET_DIR/PROJECT_BLUEPRINT.md"
  cat > "$TARGET_DIR/ROADMAP.md" <<'ROADMAP'
# Roadmap

Isi roadmap ini setelah `PROJECT_BLUEPRINT.md` disetujui.

Wajib mengikuti:
- `prod-guide-versiku/AI_RULES_ROADMAP.md`
- `prod-guide-versiku/AI_RULES_MATURITY.md`
- `prod-guide-versiku/AI_DEFINITION_OF_DONE.md`
- `prod-guide-versiku/AI_RULES_PRODUCTION_READY.md`

## Phase 0: Blueprint Lock
- [ ] Scope, non-goals, repo mode, backend mode, maturity level, dan open questions disetujui.
- [ ] Checkpoint: blueprint approved.
ROADMAP
  cat > "$TARGET_DIR/PROMPT_TO_FEATURE_SPECS.md" <<'PROMPT'
Baca `PROJECT_BLUEPRINT.md` dan `ROADMAP.md`.
Pecah setiap fitur P0/P1 menjadi spesifikasi terpisah mengikuti `prod-guide-versiku/AI_FEATURE_TEMPLATE.md`.

PENTING:
- Jangan coding dulu.
- Jangan menambah DB/API jika fitur ternyata UI-only.
- Tandai asumsi dan risiko.
- Buat ADR untuk keputusan arsitektur besar.
- Buat threat model untuk fitur dengan auth, payment, ownership, upload, atau PII.
PROMPT
fi

echo "Generated: $TARGET_DIR"
