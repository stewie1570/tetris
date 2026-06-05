#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="$ROOT/.tools"
NETCOREDBG="$TOOLS_DIR/netcoredbg/netcoredbg"
VERSION="3.1.3-1062"
ARCH="$(uname -m)"

case "$ARCH" in
    x86_64)  ASSET="netcoredbg-linux-amd64.tar.gz" ;;
    aarch64) ASSET="netcoredbg-linux-arm64.tar.gz" ;;
    *)
        echo "Unsupported architecture: $ARCH" >&2
        exit 1
        ;;
esac

if [[ -x "$NETCOREDBG" ]]; then
    echo "netcoredbg already installed at $NETCOREDBG"
    exit 0
fi

mkdir -p "$TOOLS_DIR"
TMP="$TOOLS_DIR/$ASSET"
URL="https://github.com/Samsung/netcoredbg/releases/download/$VERSION/$ASSET"

echo "Downloading netcoredbg $VERSION ($ASSET)..."
curl -fsSL -o "$TMP" "$URL"
tar -xzf "$TMP" -C "$TOOLS_DIR"
rm "$TMP"
chmod +x "$NETCOREDBG"
echo "Installed netcoredbg at $NETCOREDBG"
