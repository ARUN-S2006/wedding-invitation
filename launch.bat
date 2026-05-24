@echo off
title Musthaq & Afnan Wedding Invitation Launcher
echo ====================================================
echo   Musthaq & Afnan Wedding Invitation Web Launcher
echo ====================================================
echo.

:: Move to the launcher file folder so npm/node runs in the correct project
cd /d "%~dp0"

:: Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js was not found on this machine.
  echo Please install Node.js from https://nodejs.org/ and run this launcher again.
  pause
  exit /b 1
)

echo Installing dependencies if needed...
if not exist "node_modules" (
  npm install
  if %ERRORLEVEL% neq 0 (
    echo npm install failed. Check your internet connection and Node installation.
    pause
    exit /b 1
  )
)

echo Starting local server on http://localhost:3000 ...
echo (Close this command window to stop the server)
start "" http://localhost:3000
node server.js
