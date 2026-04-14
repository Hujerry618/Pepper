@echo off
chcp 65001 >nul
echo ========================================
echo   Personal Panel 协议处理器安装程序
echo   (PowerShell 版本 - 支持中文路径)
echo ========================================
echo.

:: 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] 需要管理员权限！
    echo 请右键点击此文件，选择"以管理员身份运行"
    echo.
    pause
    exit /b 1
)

echo [1/2] 备份旧版本...
if exist "%~dp0launcher.bat" copy "%~dp0launcher.bat" "%~dp0launcher.bat.bak" >nul
if exist "%~dp0launcher.vbs" copy "%~dp0launcher.vbs" "%~dp0launcher.vbs.bak" >nul

echo [2/2] 注册 mypanel:// 协议...
reg add "HKEY_CLASSES_ROOT\mypanel" /v "" /t REG_SZ /d "URL:mypanel Protocol" /f >nul
reg add "HKEY_CLASSES_ROOT\mypanel" /v "URL Protocol" /t REG_SZ /d "" /f >nul
reg add "HKEY_CLASSES_ROOT\mypanel\shell" /v "" /t REG_SZ /d "open" /f >nul
reg add "HKEY_CLASSES_ROOT\mypanel\shell\open" /v "" /t REG_SZ /d "open" /f >nul

:: 使用 PowerShell 作为协议处理器
reg add "HKEY_CLASSES_ROOT\mypanel\shell\open\command" /v "" /t REG_SZ /d "powershell.exe -ExecutionPolicy Bypass -File \"%~dp0launcher.ps1\" \"%%1\"" /f >nul

echo.
echo ========================================
echo   安装完成！
echo ========================================
echo.
echo 测试：按 Win+R，输入 mypanel://notepad.exe
echo 日志：%%TEMP%%\mypanel-debug.txt
echo.
pause
