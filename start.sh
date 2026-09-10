#!/usr/bin/env bash

# ==============================================================================
# Wasalt Transit Operations Command - Admin & Fleet
# macOS (MacBook) & Linux Local Environment Bootstrap & Start Script
# ==============================================================================

set -e

# Resolve repository root directory regardless of where script was invoked from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

# ANSI Color Codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================================${NC}"
echo -e "${CYAN}${BOLD}  WASALT TRANSIT OPERATIONS COMMAND - ADMIN & FLEET     ${NC}"
echo -e "${CYAN}  macOS (MacBook) & Linux Bootstrap & Start Script       ${NC}"
echo -e "${CYAN}========================================================${NC}"
echo ""

# 1. Verify Node.js
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Node.js is not installed or not found in your PATH.${NC}"
    echo -e "${YELLOW}To install Node.js on macOS using Homebrew, run:${NC}"
    echo -e "  brew install node"
    echo -e "${YELLOW}Or download the LTS installer from:${NC}"
    echo -e "  https://nodejs.org/"
    exit 1
fi

NODE_VER=$(node -v)
echo -e "${GREEN}[OK] Node.js detected: ${NODE_VER}${NC}"

# 2. Verify npm
if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] npm was not found. Please verify your Node.js installation.${NC}"
    exit 1
fi

NPM_VER=$(npm -v)
echo -e "${GREEN}[OK] npm detected: v${NPM_VER}${NC}"

# 3. Check / Ensure .env in admin directory
if [ ! -f "admin/.env" ]; then
    echo -e "${YELLOW}[INFO] admin/.env not found. Initializing configuration...${NC}"
    if [ -f "admin/.env.example" ]; then
        cp "admin/.env.example" "admin/.env"
        echo -e "${GREEN}[OK] Created admin/.env from template.${NC}"
    else
        echo -e "${YELLOW}[INFO] Generating verified production admin/.env...${NC}"
        cat << 'EOF' > admin/.env
VITE_FIREBASE_API_KEY=AIzaSyChUygjS8ysqYzCk6VjoGMa1YdR5C4L77s
VITE_FIREBASE_AUTH_DOMAIN=tracking-72393.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tracking-72393-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tracking-72393
VITE_FIREBASE_STORAGE_BUCKET=tracking-72393.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=701536417094
VITE_FIREBASE_APP_ID=1:701536417094:web:743f96fac5e92dd46da147
VITE_MASTER_ADMIN_USERNAME=masteradmin
VITE_MASTER_ADMIN_PASSWORD=adminPassword2026!
VITE_MASTER_ADMIN_TOTP_SECRET=WASALTADMINSECRET
EOF
        echo -e "${GREEN}[OK] Created verified admin/.env.${NC}"
    fi
else
    echo -e "${GREEN}[OK] Configuration file admin/.env is present.${NC}"
fi

# Helper function to open browser cross-platform (macOS / Linux)
open_browser() {
    local url="$1"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$url" 2>/dev/null || true
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" 2>/dev/null || true
    fi
}

# 4. Parse CLI Argument or Prompt Mode
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
    echo ""
    echo -e "${CYAN}Select application to launch:${NC}"
    echo -e "  ${BOLD}[1] Wasalt Admin Portal (Web Dashboard) [Default]${NC}"
    echo -e "  ${BOLD}[2] Wasalt Mobile App (Expo Driver & Passenger)${NC}"
    echo -e "  ${BOLD}[3] Both (Admin Portal + Mobile App)${NC}"
    echo ""
    read -r -p "Enter choice [1-3, default=1]: " USER_CHOICE
    TARGET="${USER_CHOICE:-1}"
fi

case "$TARGET" in
    2|--mobile|mobile)
        echo ""
        echo -e "${CYAN}[INFO] Installing/verifying mobile app dependencies in 'sya7a new'...${NC}"
        cd "sya7a new"
        npm install
        echo -e "${GREEN}[OK] Mobile dependencies verified.${NC}"
        echo ""
        echo -e "${CYAN}========================================================${NC}"
        echo -e "${GREEN}${BOLD}  Launching Wasalt Mobile App (Expo)                    ${NC}"
        echo -e "${CYAN}========================================================${NC}"
        npx expo start
        ;;
    3|--both|both)
        echo ""
        echo -e "${CYAN}[INFO] Preparing Admin Portal and Mobile App dependencies...${NC}"
        (cd admin && npm install)
        (cd "sya7a new" && npm install)
        echo -e "${GREEN}[OK] All dependencies verified.${NC}"
        echo ""
        echo -e "${CYAN}========================================================${NC}"
        echo -e "${GREEN}${BOLD}  Starting Admin Portal and Mobile App concurrently...  ${NC}"
        echo -e "${CYAN}========================================================${NC}"

        # Clean shutdown trap on Ctrl+C
        ADMIN_PID=""
        cleanup() {
            echo ""
            echo -e "${YELLOW}Stopping all services...${NC}"
            if [ -n "$ADMIN_PID" ]; then
                kill "$ADMIN_PID" 2>/dev/null || true
            fi
            exit 0
        }
        trap cleanup SIGINT SIGTERM

        # Start Admin in background
        (
            cd admin
            sleep 2 && open_browser "http://localhost:5173/" &
            npm run dev -- --host 127.0.0.1 --port 5173
        ) &
        ADMIN_PID=$!

        echo -e "${GREEN}[OK] Admin portal started in background (PID: $ADMIN_PID).${NC}"
        echo -e "${CYAN}Starting Expo Mobile App in this foreground terminal...${NC}"
        cd "sya7a new"
        npx expo start
        ;;
    *)
        echo ""
        echo -e "${CYAN}[INFO] Installing/verifying admin portal dependencies in admin/...${NC}"
        cd admin
        npm install
        echo -e "${GREEN}[OK] Admin dependencies verified successfully.${NC}"
        echo ""
        echo -e "${CYAN}========================================================${NC}"
        echo -e "${GREEN}${BOLD}  Launching Wasalt Admin Portal on http://localhost:5173/${NC}"
        echo -e "${CYAN}========================================================${NC}"
        
        # Open default browser after 2 seconds
        (sleep 2 && open_browser "http://localhost:5173/") &
        
        npm run dev -- --host 127.0.0.1 --port 5173
        ;;
esac
