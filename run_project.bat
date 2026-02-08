@echo off
echo ===================================================
echo   PulseGuard Local Network Launcher
echo ===================================================
echo.
echo [1/2] Starting Backend API (Port 8000)...
start "PulseGuard Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend Web App (Port 3000)...
cd web
start "PulseGuard Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo   Servers are running!
echo   To access from other devices on your WiFi:
echo   1. Find your IP address by running 'ipconfig' in a terminal.
echo   2. Frontend URL: http://<YOUR_IP>:3000
echo   3. Backend URL:  http://<YOUR_IP>:8000
echo ===================================================
echo.
pause
