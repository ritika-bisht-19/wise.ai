@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "LOG_DIR=%ROOT_DIR%\.logs"
set "FACE_API_DIR=%ROOT_DIR%\ai-services\face_api"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "FACE_VENV=%FACE_API_DIR%\.venv311"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

where npm >nul 2>&1
if errorlevel 1 (
  echo Missing required command: npm
  exit /b 1
)

set "PYTHON_CMD=py -3.11"
%PYTHON_CMD% --version >nul 2>&1
if errorlevel 1 (
  set "PYTHON_CMD=py -3"
)
%PYTHON_CMD% --version >nul 2>&1
if errorlevel 1 (
  echo Missing Python launcher. Install Python 3.11+ and rerun.
  exit /b 1
)

echo Using Python command: %PYTHON_CMD%

echo Installing backend deps (if needed)...
if not exist "%BACKEND_DIR%\node_modules" (
  pushd "%BACKEND_DIR%"
  call npm install
  if errorlevel 1 exit /b 1
  popd
)

echo Installing frontend deps (if needed)...
if not exist "%FRONTEND_DIR%\node_modules" (
  pushd "%FRONTEND_DIR%"
  call npm install
  if errorlevel 1 exit /b 1
  popd
)

echo Preparing Face API virtual environment...
if not exist "%FACE_VENV%\Scripts\python.exe" (
  pushd "%FACE_API_DIR%"
  call %PYTHON_CMD% -m venv .venv311
  if errorlevel 1 exit /b 1
  popd
)

pushd "%FACE_API_DIR%"
call "%FACE_VENV%\Scripts\python.exe" -m pip install --upgrade pip >nul
call "%FACE_VENV%\Scripts\pip.exe" install -r requirements.txt
if errorlevel 1 exit /b 1
call "%FACE_VENV%\Scripts\pip.exe" install opencv-python^<4.13 numpy^<2 setuptools^<81 dlib^<20
if errorlevel 1 exit /b 1
popd

if exist "%ROOT_DIR%\.env" (
  for /f "usebackq tokens=1,* delims==" %%A in ("%ROOT_DIR%\.env") do (
    set "key=%%A"
    if not "!key!"=="" if not "!key:~0,1!"=="#" set "%%A=%%B"
  )
)

echo Starting backend on http://localhost:3000
start "WISE Backend" cmd /k "cd /d \"%BACKEND_DIR%\" && npm run start"

echo Starting frontend on http://localhost:5173
start "WISE Frontend" cmd /k "cd /d \"%FRONTEND_DIR%\" && npm run dev"

echo Starting Face API on http://localhost:8001
start "WISE Face API" cmd /k "cd /d \"%FACE_API_DIR%\" && call .venv311\Scripts\activate && python main.py"

echo.
echo W.I.S.E launch initiated.
echo Logs are printed in each new terminal window.
echo Open: http://localhost:5173
