@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   ðŸŒ¶ï¸ Advanced Personal Panel - æŽ¨é€åˆ° GitHub
echo ========================================
echo.
echo ä»“åº“ï¼šhttps://github.com/hujerry618/advanced-personal-panel
echo.
echo è¯·åœ¨å¼¹å‡ºçš„çª—å£ä¸­è¾“å…¥ GitHub å¯†ç æˆ– Token
echo (å‹¾é€‰"è®°ä½å‡­æ®"ä»¥åŽå°±ä¸ç”¨å†è¾“å…¥äº†)
echo.
pause
echo.
echo å¼€å§‹æŽ¨é€...
echo.

cd /d "%~dp0"

REM ä½¿ç”¨ Git å‡­æ®ç®¡ç†å™¨
git config --global credential.helper wincred

REM æŽ¨é€ä»£ç 
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   âœ… æŽ¨é€æˆåŠŸï¼
    echo ========================================
    echo.
    echo ðŸŽ‰ é¡¹ç›®å·²ä¸Šä¼ åˆ° GitHub!
    echo.
    echo è®¿é—®ä»“åº“ï¼šhttps://github.com/hujerry618/advanced-personal-panel
    echo.
    echo ä¸‹ä¸€æ­¥:
    echo 1. è®¿é—®ä¸Šé¢çš„é“¾æŽ¥æŸ¥çœ‹ä½ çš„ä»£ç 
    echo 2. åœ¨ä»“åº“ Settings ^â†’ Pages ä¸­å¯ç”¨ GitHub Pages
    echo 3. è®¿é—®ä½ çš„åœ¨çº¿é¢æ¿ï¼šhttps://hujerry618.github.io/advanced-personal-panel/
    echo.
) else (
    echo.
    echo ========================================
    echo   âŒ æŽ¨é€å¤±è´¥
    echo ========================================
    echo.
    echo å¯èƒ½åŽŸå› :
    echo 1. å¯†ç æˆ– Token é”™è¯¯
    echo 2. ä»“åº“ä¸å­˜åœ¨ (éœ€è¦å…ˆåœ¨ GitHub åˆ›å»º)
    echo 3. ç½‘ç»œè¿žæŽ¥é—®é¢˜
    echo.
    echo è§£å†³æ–¹æ³•:
    echo 1. åˆ›å»ºä»“åº“ï¼šhttps://github.com/new
    echo    ä»“åº“åï¼šadvanced-personal-panel
    echo    è®¾ä¸º Public æˆ– Private éƒ½å¯ä»¥
    echo.
    echo 2. ä½¿ç”¨ Token è€Œä¸æ˜¯å¯†ç :
    echo    https://github.com/settings/tokens
    echo    ç”Ÿæˆ Token æ—¶å‹¾é€‰ repo æƒé™
    echo.
    echo 3. æ£€æŸ¥ç½‘ç»œè¿žæŽ¥
    echo.
)

echo æŒ‰ä»»æ„é”®å…³é—­çª—å£...
pause >nul
