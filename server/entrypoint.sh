#!/bin/sh
# =============================================================
# TaskFlow — Docker Entrypoint
# Runs the seed pipeline ONCE on startup, then starts the server
# =============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║    TaskFlow Server — Starting Up             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Wait for MongoDB to be truly ready (healthcheck passes before this runs,
# but give Mongoose an extra moment to be safe on slow machines)
echo "  ⏳  Waiting 2s for MongoDB to be fully ready..."
sleep 2

# Run the seed pipeline
echo "  🌱  Running data seed pipeline..."
echo ""
node seed/seeder.js

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "  ❌  Seed pipeline failed (exit code $EXIT_CODE)"
  echo "  ❌  Server will NOT start. Fix seed errors and retry."
  exit $EXIT_CODE
fi

echo ""
echo "  🚀  Starting Express server..."
echo ""

# Start the server with nodemon in dev, node in prod
if [ "$NODE_ENV" = "production" ]; then
  exec node index.js
else
  exec npx nodemon index.js
fi
