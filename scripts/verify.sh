#!/usr/bin/env bash
set -euo pipefail

cd "$(cd "$(dirname "$0")" && pwd)/.."

if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
  TYPECHECK_CMD=(pnpm typecheck)
  TEST_CMD=(pnpm vitest --run)
  LINT_CMD=(pnpm lint)
else
  PM="npm"
  TYPECHECK_CMD=(npm run typecheck)
  TEST_CMD=(npm test)
  LINT_CMD=(npm run lint)
fi

"${TYPECHECK_CMD[@]}"
"${TEST_CMD[@]}"

if node -e "const pkg = require('./package.json'); process.exit(pkg.scripts?.lint ? 0 : 1);"; then
  "${LINT_CMD[@]}"
fi
