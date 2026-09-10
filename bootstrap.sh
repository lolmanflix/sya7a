#!/usr/bin/env bash
# macOS (MacBook) & Linux Bootstrap & Start Entrypoint
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
exec bash "$SCRIPT_DIR/start.sh" "$@"
