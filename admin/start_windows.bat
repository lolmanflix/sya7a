@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   WASALT TRANSIT OPERATIONS COMMAND - ADMIN PORTAL
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js (LTS version) from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting Wasalt Admin Portal...
node serve.js
pause
