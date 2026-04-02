#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

OUT_FILE="${1:-termux_env_report.txt}"
{
  echo "=== Android Master Boost - Termux Environment Check ==="
  echo "timestamp=$(date -Iseconds)"
  echo "pwd=$(pwd)"
  echo
  echo "--- Versions ---"
  command -v node >/dev/null 2>&1 && echo "node=$(node -v)" || echo "node=missing"
  command -v pnpm >/dev/null 2>&1 && echo "pnpm=$(pnpm -v)" || echo "pnpm=missing"
  command -v java >/dev/null 2>&1 && echo "java=$(java -version 2>&1 | head -n 1)" || echo "java=missing"
  command -v javac >/dev/null 2>&1 && echo "javac=$(javac -version 2>&1)" || echo "javac=missing"
  echo "ANDROID_HOME=${ANDROID_HOME:-missing}"
  echo "ANDROID_SDK_ROOT=${ANDROID_SDK_ROOT:-missing}"
  echo
  echo "--- Storage ---"
  df -h .
  echo
  echo "--- Android SDK folders ---"
  if [ -n "${ANDROID_HOME:-}" ]; then
    ls -1 "$ANDROID_HOME" 2>/dev/null || echo "cannot list ANDROID_HOME"
  else
    echo "ANDROID_HOME not set"
  fi
  echo
  echo "--- Expo/Gradle quick probes ---"
  if [ -f package.json ]; then
    echo "package.json=present"
  else
    echo "package.json=missing"
  fi
  if [ -d android ]; then
    echo "android_dir=present"
  else
    echo "android_dir=missing (run: npx expo prebuild --platform android)"
  fi
} | tee "$OUT_FILE"

echo "Saved report to $OUT_FILE"
