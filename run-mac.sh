#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/.logs"
FACE_API_DIR="$ROOT_DIR/ai-services/face_api"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
FACE_VENV="$FACE_API_DIR/.venv311"

mkdir -p "$LOG_DIR"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

need_cmd npm

PYTHON_BIN=""
if command -v python3.11 >/dev/null 2>&1; then
  PYTHON_BIN="python3.11"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
else
  echo "Missing Python. Install Python 3.11+ and rerun."
  exit 1
fi

echo "Using Python: $PYTHON_BIN"

echo "Installing backend deps (if needed)..."
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  (cd "$BACKEND_DIR" && npm install)
fi

echo "Installing frontend deps (if needed)..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  (cd "$FRONTEND_DIR" && npm install)
fi

echo "Preparing Face API virtual environment..."
if [ ! -d "$FACE_VENV" ]; then
  "$PYTHON_BIN" -m venv "$FACE_VENV"
fi

# shellcheck disable=SC1091
source "$FACE_VENV/bin/activate"
python -m pip install --upgrade pip >/dev/null
pip install -r "$FACE_API_DIR/requirements.txt"
# Keep these pins for current compatibility with this project.
pip install "opencv-python<4.13" "numpy<2" "setuptools<81" "dlib<20"
deactivate

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT_DIR/.env"
  set +a
fi

echo "Starting backend on http://localhost:3000"
(
  cd "$BACKEND_DIR"
  npm run start
) >"$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173"
(
  cd "$FRONTEND_DIR"
  npm run dev
) >"$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo "Starting Face API on http://localhost:8001"
(
  cd "$FACE_API_DIR"
  # shellcheck disable=SC1091
  source "$FACE_VENV/bin/activate"
  python main.py
) >"$LOG_DIR/face-api.log" 2>&1 &
FACE_PID=$!

cleanup() {
  echo
  echo "Stopping services..."
  kill "$BACKEND_PID" "$FRONTEND_PID" "$FACE_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

echo

echo "W.I.S.E is starting. Logs:"
echo "  Backend : $LOG_DIR/backend.log"
echo "  Frontend: $LOG_DIR/frontend.log"
echo "  Face API: $LOG_DIR/face-api.log"
echo
echo "Open: http://localhost:5173"
echo "Press Ctrl+C to stop all services."

wait
