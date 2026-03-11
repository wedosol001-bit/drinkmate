#!/bin/bash
# DrinkMate Full Deploy Script for Contabo
# Run as root on the server: bash deploy.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

APP_DIR="/var/www/drinkmate"
LOG_DIR="/var/log/drinkmate"
REPO_URL="https://github.com/wedosol001-bit/drinkmate.git"
BRANCH="main"

echo ""
echo "🚀 DrinkMate Deployment Starting..."
echo ""

# ── 1. SYSTEM SETUP ──────────────────────────────────────────────────────────
ok "Setting up directories..."
mkdir -p $APP_DIR $LOG_DIR

ok "Installing system dependencies..."
apt update -qq
apt install -y nginx certbot python3-certbot-nginx git curl

ok "Installing Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
node -v && npm -v

ok "Installing PM2..."
npm install -g pm2 2>/dev/null || true

# ── 2. CLONE / UPDATE REPO ───────────────────────────────────────────────────
ok "Cloning/updating repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd $APP_DIR
  git fetch origin
  git reset --hard origin/$BRANCH
  git clean -fd
else
  git clone -b $BRANCH $REPO_URL $APP_DIR
  cd $APP_DIR
fi
ok "Repo ready at $APP_DIR"

# ── 3. BACKEND SETUP ─────────────────────────────────────────────────────────
ok "Installing backend dependencies..."
cd $APP_DIR/server
npm install --production
ok "Backend dependencies installed"

# ── 4. FRONTEND SETUP ────────────────────────────────────────────────────────
ok "Installing frontend dependencies..."
cd $APP_DIR/drinkmate-main
npm install

ok "Building frontend (standalone)..."
export NEXT_PUBLIC_API_URL="https://drinkmate.sa/api"
export NEXT_PUBLIC_FRONTEND_URL="https://drinkmate.sa"
export NEXT_PUBLIC_API_RETRY_ATTEMPTS="3"
export NEXT_PUBLIC_API_RETRY_DELAY="1000"
export NEXT_PUBLIC_API_TIMEOUT="30000"
export NEXT_PUBLIC_MAX_CONCURRENT_CHATS="10"
export NEXT_PUBLIC_MAX_FILE_SIZE_MB="10"
npm run build

ok "Copying static assets into standalone..."
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
ok "Frontend built successfully"

# ── 5. PM2 ───────────────────────────────────────────────────────────────────
ok "Starting services with PM2..."
cd $APP_DIR
pm2 delete all 2>/dev/null || true
pm2 start deployment/ecosystem.config.js
pm2 save
pm2 startup | tail -1 | bash 2>/dev/null || warn "Run 'pm2 startup' manually if needed"
ok "PM2 services started"

# ── 6. NGINX ─────────────────────────────────────────────────────────────────
ok "Configuring Nginx..."
cp deployment/nginx.conf /etc/nginx/sites-available/drinkmate.sa
ln -sf /etc/nginx/sites-available/drinkmate.sa /etc/nginx/sites-enabled/drinkmate.sa
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
ok "Nginx configured"

# ── 7. SSL ───────────────────────────────────────────────────────────────────
warn "SSL setup — make sure DNS is pointed to 45.151.122.20 first!"
echo ""
echo "When DNS is ready, run:"
echo "  certbot --nginx -d drinkmate.sa -d www.drinkmate.sa -d api.drinkmate.sa"
echo ""

# ── 8. HEALTH CHECK ──────────────────────────────────────────────────────────
ok "Waiting for services to start..."
sleep 8

echo ""
echo "── PM2 Status ──────────────────────────────"
pm2 list
echo ""

if curl -sf http://localhost:3000/health > /dev/null; then
  ok "Backend is healthy on :3000"
else
  warn "Backend health check failed — check: pm2 logs drinkmate-backend"
fi

if curl -sf http://localhost:3001 > /dev/null; then
  ok "Frontend is healthy on :3001"
else
  warn "Frontend health check failed — check: pm2 logs drinkmate-frontend"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "  Frontend:  http://45.151.122.20:3001 (or https://drinkmate.sa after SSL)"
echo "  Backend:   http://45.151.122.20:3000 (or https://api.drinkmate.sa after SSL)"
echo "  Logs:      pm2 logs"
echo "  Status:    pm2 list"
echo ""