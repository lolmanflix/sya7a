#!/usr/bin/env bash

# ==============================================================================
# Wasalt Admin Portal - macOS (MacBook) & Linux Launcher
# ==============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Install via Homebrew: brew install node"
    echo "Or download from: https://nodejs.org/"
    exit 1
fi

if [ "$1" == "--dev" ]; then
    echo "Starting in development mode..."
    npm install
    npm run dev -- --host 127.0.0.1 --port 5173
else
    echo "Starting Wasalt Admin Portal (Production Bundle)..."
    node serve.js
fi
