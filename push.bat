@echo off
echo ========================================
echo   Advanced Personal Panel - Push to GitHub
echo ========================================
echo.
echo Repository: https://github.com/Hujerry618/Pepper
echo.
echo Starting push...
echo.

cd /d "%~dp0"

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Visit: https://github.com/Hujerry618/Pepper
    echo.
) else (
    echo.
    echo ========================================
    echo   FAILED
    echo ========================================
    echo.
    echo Please use Token method:
    echo git push https://hujerry618:YOUR_TOKEN@github.com/Hujerry618/Pepper.git main
    echo.
)

pause
