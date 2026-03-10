#!/usr/bin/env bash
set -euo pipefail

cd "$(cd "$(dirname "$0")" && pwd)/.."

pnpm typecheck
pnpm vitest --run

if node -e "const pkg = require('./package.json'); process.exit(pkg.scripts?.lint ? 0 : 1);"; then
  pnpm lint
fi
