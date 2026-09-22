@echo off
setlocal enabledelayedexpansion
title MOUSE HUB - Dev Server

cd /d "%~dp0"

echo ============================================
echo   MOUSE HUB - site launcher
echo ============================================
echo.

REM --- Check Node.js ---
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo [OK]   Node.js      : !NODE_VER!

REM --- Check npm ---
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found.
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK]   npm          : !NPM_VER!

REM --- Check dependencies ---
if not exist "node_modules" (
    echo [WARN] node_modules missing - running npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        echo.
        pause
        exit /b 1
    )
) else (
    echo [OK]   Dependencies : installed
)

REM --- Check port 3000 ---
set PORT=3000
netstat -ano | findstr /r /c:":%PORT% .*LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo [WARN] Port %PORT% already in use - site may be running.
) else (
    echo [OK]   Port %PORT%     : free
)

echo.
echo --------------------------------------------
echo   STATE: starting dev server (Next.js 14)
echo   URL  : http://localhost:%PORT%
echo   Stop : close this window or press Ctrl+C
echo --------------------------------------------
echo.

REM --- Open browser after 4 seconds in a separate process ---
start "" cmd /c "timeout /t 4 >nul & start http://localhost:%PORT%"

REM --- Run dev server (blocks this window) ---
call npm run dev

echo.
echo [STATE] Server stopped.
pause
