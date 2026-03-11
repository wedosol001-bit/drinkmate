#!/usr/bin/env bash
set -e

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$FRONTEND_DIR"

# ── CONFIG ───────────────────────────────────────
CONTABO_HOST="45.151.122.20"
CONTABO_USER="root"
SSH_KEY="$HOME/.ssh/drinkmate_contabo"
REMOTE_DIR="/var/www/drinkmate"
# ─────────────────────────────────────────────────

# Production env vars for build
export NEXT_PUBLIC_API_URL="https://api.drinkmate.sa"
export NEXT_PUBLIC_FRONTEND_URL="https://drinkmate.sa"
export NEXT_PUBLIC_API_RETRY_ATTEMPTS="3"
export NEXT_PUBLIC_API_RETRY_DELAY="1000"
export NEXT_PUBLIC_API_TIMEOUT="30000"
export NEXT_PUBLIC_MAX_CONCURRENT_CHATS="10"
export NEXT_PUBLIC_MAX_FILE_SIZE_MB="10"

echo "[LOG] Building frontend..."
npm run build

echo "[LOG] Preparing standalone..."
STANDALONE="$FRONTEND_DIR/.next/standalone"
if [ ! -d "$STANDALONE" ]; then
  echo "Error: .next/standalone not found."
  exit 1
fi

cp -r "$FRONTEND_DIR/public" "$STANDALONE/public"
mkdir -p "$STANDALONE/.next"
cp -r "$FRONTEND_DIR/.next/static" "$STANDALONE/.next/static"

echo "[LOG] Creating tarball..."
tar -czvf "$FRONTEND_DIR/frontend-deploy.tar.gz" -C "$FRONTEND_DIR/.next" standalone

echo "[LOG] Uploading to Contabo..."
ssh -i "$SSH_KEY" "$CONTABO_USER@$CONTABO_HOST" "mkdir -p $REMOTE_DIR"
scp -i "$SSH_KEY" "$FRONTEND_DIR/frontend-deploy.tar.gz" "$CONTABO_USER@$CONTABO_HOST:$REMOTE_DIR/"

echo "[LOG] Extracting and starting app..."
ssh -i "$SSH_KEY" "$CONTABO_USER@$CONTABO_HOST" "
  cd $REMOTE_DIR &&
  tar -xzvf frontend-deploy.tar.gz &&
  pm2 stop drinkmate 2>/dev/null || true &&
  JWT_SECRET='59ecH3Cn3hjuykKZGnLTMuZvBSsprjWFWrzAKPXJX5k=' \
  PORT=3000 \
  NODE_ENV=production \
  pm2 start standalone/server.js --name drinkmate &&
  pm2 save
"

echo ""
echo "✅ Deployed! App running at http://$CONTABO_HOST:3000"
