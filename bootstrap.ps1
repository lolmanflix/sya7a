# Wasalt Transit Operations Command - Admin & Fleet
# PowerShell Bootstrap & Launch Script
param (
    [string]$Target = "1"
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  WASALT TRANSIT OPERATIONS COMMAND - ADMIN & FLEET     " -ForegroundColor Cyan
Write-Host "  Local Environment Bootstrap & Launch Script           " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please download and install Node.js (LTS version recommended) from:" -ForegroundColor Yellow
    Write-Host "  https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

$nodeVer = node -v
Write-Host "[OK] Node.js detected: $nodeVer" -ForegroundColor Green

# 2. Check npm
$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCmd) {
    Write-Host "[ERROR] npm was not found. Please verify your Node.js installation." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}
$npmVer = npm -v
Write-Host "[OK] npm detected: v$npmVer" -ForegroundColor Green

# 3. Check / Ensure .env in admin
$envPath = "admin\.env"
$envExamplePath = "admin\.env.example"

if (-not (Test-Path $envPath)) {
    Write-Host "[INFO] admin\.env not found. Initializing from admin\.env.example..." -ForegroundColor Yellow
    if (Test-Path $envExamplePath) {
        Copy-Item -Path $envExamplePath -Destination $envPath
        Write-Host "[OK] Created admin\.env from template." -ForegroundColor Green
    } else {
        Write-Host "[INFO] Creating verified production admin\.env..." -ForegroundColor Yellow
        @"
VITE_FIREBASE_API_KEY=AIzaSyChUygjS8ysqYzCk6VjoGMa1YdR5C4L77s
VITE_FIREBASE_AUTH_DOMAIN=tracking-72393.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tracking-72393-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tracking-72393
VITE_FIREBASE_STORAGE_BUCKET=tracking-72393.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=701536417094
VITE_FIREBASE_APP_ID=1:701536417094:web:743f96fac5e92dd46da147
VITE_MASTER_ADMIN_USERNAME=masteradmin
VITE_MASTER_ADMIN_PASSWORD=adminPassword2026!
VITE_MASTER_ADMIN_TOTP_SECRET=WASALTADMINSECRET
"@ | Out-File -FilePath $envPath -Encoding utf8
        Write-Host "[OK] Created verified admin\.env." -ForegroundColor Green
    }
} else {
    Write-Host "[OK] Configuration file admin\.env is present." -ForegroundColor Green
}

# 4. Mode Selection
if (-not $PSBoundParameters.ContainsKey('Target')) {
    Write-Host ""
    Write-Host "Select application to launch:" -ForegroundColor Cyan
    Write-Host "  [1] Wasalt Admin Portal (Web Dashboard) [Default]"
    Write-Host "  [2] Wasalt Mobile App (Expo Driver & Passenger)"
    Write-Host "  [3] Both (Admin Portal + Mobile App)"
    $selected = Read-Host "Enter choice [1-3, default=1]"
    if ($selected) { $Target = $selected }
}

if ($Target -eq "2" -or $Target -eq "mobile") {
    Write-Host ""
    Write-Host "[INFO] Installing/verifying mobile dependencies in 'sya7a new'..." -ForegroundColor Cyan
    Set-Location -Path "sya7a new"
    & npm install
    Write-Host "[OK] Mobile dependencies verified." -ForegroundColor Green
    Write-Host ""
    Write-Host "Launching Wasalt Mobile App (Expo)..." -ForegroundColor Green
    & npx expo start
} elseif ($Target -eq "3" -or $Target -eq "both") {
    Write-Host ""
    Write-Host "[INFO] Preparing Admin Portal and Mobile App dependencies..." -ForegroundColor Cyan
    Set-Location -Path "admin"
    & npm install
    Set-Location -Path "..\sya7a new"
    & npm install
    Set-Location -Path ".."
    Write-Host "[OK] All dependencies ready." -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting Admin Portal in new window and Mobile App here..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\admin'; Start-Process 'http://localhost:5173/'; npm run dev -- --host 127.0.0.1 --port 5173"
    Set-Location -Path "sya7a new"
    & npx expo start
} else {
    Write-Host ""
    Write-Host "[INFO] Installing/verifying admin dependencies..." -ForegroundColor Cyan
    Set-Location -Path "admin"
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "[OK] Dependencies verified successfully." -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  Launching Wasalt Admin Portal on http://localhost:5173/ " -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Start-Process "http://localhost:5173/"
    & npm run dev -- --host 127.0.0.1 --port 5173
}
