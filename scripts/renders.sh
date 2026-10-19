#!/bin/bash
# Régénère les images fixes des pièces depuis la scène 3D.
# Usage : npm run renders [-- slug…]
set -euo pipefail
PORT=3300
POSTER_STUDIO=1 NEXT_DIST_DIR=.next-affiches npx next build
POSTER_STUDIO=1 NEXT_DIST_DIR=.next-affiches setsid npx next start -p $PORT &
SERVER=$!
trap 'kill -- -$SERVER' EXIT
until curl -sf -o /dev/null http://127.0.0.1:$PORT/studio-affiches; do sleep 1; done
POSTER_BASE_URL=http://127.0.0.1:$PORT node scripts/render-posters.mjs "$@"
