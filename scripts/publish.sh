#!/usr/bin/env bash
set -euo pipefail

echo "[INFO] CWD: $(pwd)"

# 1) Build application (image)
echo "[INFO] Building Docker images..."
docker compose build
echo "[OK]   Images built."

# 2) Start database only (if not running)
echo "[INFO] Ensuring Postgres is running..."
docker compose -f docker-compose.db.yml up -d
echo "[OK]   Postgres is up."

# 3) Run Prisma migrate deploy in current host (production-safe apply only)
echo "[INFO] Applying Prisma migrations (deploy)..."
npx prisma migrate deploy --schema prisma/schema.prisma
echo "[OK]   Prisma migrate deploy done."

# 4) Start full stack (app + db)
echo "[INFO] Starting application stack..."
docker compose up -d
echo "[OK]   Application started."

echo "[OK]   publish.sh completed."


