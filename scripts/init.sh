#!/usr/bin/env bash
set -euo pipefail

echo "[INFO] CWD: $(pwd)"

# 1) Install Dependencies (README: npm install)
echo "[INFO] Installing dependencies..."
npm install
echo "[OK]   Dependencies installed."

# 2) PostgreSQL with Docker (README: docker-compose -f docker-compose.db.yml up -d)
#    Copy .env.example to .env when applicable
if [[ -f .env.example && ! -f .env ]]; then
  echo "[INFO] Creating .env from .env.example"
  cp .env.example .env
fi

if command -v docker >/dev/null 2>&1; then
  echo "[INFO] Starting Postgres (docker compose)..."
  COMPOSE_BIN="docker compose"
  if command -v docker-compose >/dev/null 2>&1; then COMPOSE_BIN="docker-compose"; fi
  $COMPOSE_BIN -f docker-compose.db.yml up -d
  echo "[OK]   Postgres started."
else
  echo "[WARN] Docker not found. Skipping DB start. Ensure DATABASE_URL is reachable."
fi

# 3) Prisma Migrate (README: npx prisma migrate dev)
echo "[INFO] Running Prisma Migrate (dev)..."
npx prisma migrate dev --schema prisma/schema.prisma
echo "[OK]   Prisma Migrate dev completed."

# 4) Prisma Client Generate (README: npx prisma generate)
echo "[INFO] Generating Prisma Client..."
npx prisma generate
echo "[OK]   Prisma Client generated."

# 5) Seed database (README: npm run seed)
echo "[INFO] Seeding database..."
npm run seed
echo "[OK]   Seed done."

echo "[OK]   init.sh completed per README steps."

