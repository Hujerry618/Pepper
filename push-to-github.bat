@echo off
echo.
echo ========================================
echo   Advanced Personal Panel - Push to GitHub
echo ========================================
echo.
echo Repository: https://github.com/hujerry618/advanced-personal-panel
echo.
echo Enter your GitHub password or Token in the popup window
echo (Check Remember credentials to save for next time)
echo.
pause
echo.
echo Pushing to GitHub...
echo.

cd /d "%~dp0"

REM Use Git credential manager
git config --global credential.helper wincred

REM Push code
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Project uploaded to GitHub!
    echo.
    echo Visit: https://github.com/hujerry618/advanced-personal-panel
    echo.
    echo Next steps:
    echo 1. Visit the link above to view your code
    echo 2. Enable GitHub Pages: Settings ^> Pages ^> Source: main ^> Save
    echo 3. Access your online panel: https://hujerry618.github.io/advanced-personal-panel/
    echo.
) else (
    echo.
    echo ========================================
    echo   FAILED
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Wrong password or Token
    echo 2. Repository does not exist (create it first on GitHub)
    echo 3. Network connection issue
    echo.
    echo Solutions:
    echo 1. Create repository: https://github.com/new
    echo    Repository name: advanced-personal-panel
    echo    Public or Private is OK
    echo.
    echo 2. Use Token instead of password:
    echo    https://github.com/settings/tokens
    echo    Check repo permission when generating Token
    echo.
    echo 3. Check network connection
    echo.
)

echo Press any key to close...
pause >nul
