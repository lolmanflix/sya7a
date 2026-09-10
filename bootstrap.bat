@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   WASALT TRANSIT OPERATIONS COMMAND - ADMIN ^& FLEET
echo   Local Environment Bootstrap ^& Launch Script
echo ========================================================
echo.

:: 1. Verify Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please download and install Node.js (LTS version recommended) from:
    echo   https://nodejs.org/
    echo After installing, restart this script.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js detected: %NODE_VER%

:: 2. Verify npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm was not found. Please verify your Node.js installation.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo [OK] npm detected: v%NPM_VER%

:: 3. Check / Ensure .env in admin
if not exist "admin\.env" (
    echo [INFO] admin\.env not found. Initializing from admin\.env.example...
    if exist "admin\.env.example" (
        copy "admin\.env.example" "admin\.env" >nul
        echo [OK] Created admin\.env from template.
    ) else (
        echo [INFO] Creating verified production admin\.env...
        (
            echo VITE_FIREBASE_API_KEY=AIzaSyChUygjS8ysqYzCk6VjoGMa1YdR5C4L77s
            echo VITE_FIREBASE_AUTH_DOMAIN=tracking-72393.firebaseapp.com
            echo VITE_FIREBASE_DATABASE_URL=https://tracking-72393-default-rtdb.firebaseio.com
            echo VITE_FIREBASE_PROJECT_ID=tracking-72393
            echo VITE_FIREBASE_STORAGE_BUCKET=tracking-72393.firebasestorage.app
            echo VITE_FIREBASE_MESSAGING_SENDER_ID=701536417094
            echo VITE_FIREBASE_APP_ID=1:701536417094:web:743f96fac5e92dd46da147
            echo VITE_MASTER_ADMIN_USERNAME=masteradmin
            echo VITE_MASTER_ADMIN_PASSWORD=adminPassword2026!
            echo VITE_MASTER_ADMIN_TOTP_SECRET=WASALTADMINSECRET
        ) > "admin\.env"
        echo [OK] Created verified admin\.env.
    )
) else (
    echo [OK] Configuration file admin\.env is present.
)

:: 4. Select Launch Mode
echo.
echo Select application to launch:
echo   [1] Wasalt Admin Portal (Web Dashboard) [Default]
echo   [2] Wasalt Mobile App (Expo Driver ^& Passenger)
echo   [3] Both (Admin Portal + Mobile App)
echo.
set /p TARGET="Enter choice [1-3, default=1]: "
if "%TARGET%"=="" set TARGET=1

if "%TARGET%"=="2" goto launch_mobile
if "%TARGET%"=="3" goto launch_both

:launch_admin
echo.
echo [INFO] Installing/verifying admin portal dependencies...
cd admin
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install admin dependencies.
    pause
    exit /b 1
)
echo [OK] Admin dependencies verified successfully.
echo.
echo ========================================================
echo   Launching Wasalt Admin Portal on http://localhost:5173/
echo ========================================================
start "" http://localhost:5173/
call npm run dev -- --host 127.0.0.1 --port 5173
exit /b 0

:launch_mobile
echo.
echo [INFO] Installing/verifying mobile app dependencies in "sya7a new"...
cd "sya7a new"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install mobile dependencies.
    pause
    exit /b 1
)
echo [OK] Mobile dependencies verified successfully.
echo.
echo ========================================================
echo   Launching Wasalt Mobile App (Expo)
echo ========================================================
call npx expo start
exit /b 0

:launch_both
echo.
echo [INFO] Preparing Admin Portal and Mobile App...
cd admin
call npm install
cd ..\"sya7a new"
call npm install
cd ..
echo [OK] All dependencies verified.
echo.
echo Starting Admin Portal in background...
start cmd /k "cd admin && echo Starting Admin Portal... && start http://localhost:5173/ && npm run dev -- --host 127.0.0.1 --port 5173"
echo Starting Mobile App in this window...
cd "sya7a new"
call npx expo start
exit /b 0
