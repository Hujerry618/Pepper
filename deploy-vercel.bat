@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 Deploy to Vercel
echo ========================================
echo.
echo This script will help you deploy the backend to Vercel
echo.
echo Steps:
echo 1. Install Vercel CLI (if not installed)
echo 2. Login to Vercel
echo 3. Deploy the backend
echo.
pause
echo.

cd /d "%~dp0\backend"

echo Checking Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found, installing...
    npm install -g vercel
)

echo.
echo Logging in to Vercel...
vercel login

echo.
echo Deploying to Vercel...
vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy the deployment URL
echo 2. Update sync.js with the API URL
echo 3. Set environment variables in Vercel dashboard
echo.

pause
