@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Personal Panel 协议处理器安装程序
echo ========================================
echo.

:: 获取当前脚本所在目录（去除末尾反斜杠）
set LAUNCHER_DIR=%~dp0
set LAUNCHER_DIR=%LAUNCHER_DIR:~0,-1%

echo 正在注册 mypanel:// 协议...
echo 安装目录：%LAUNCHER_DIR%
echo.

:: 使用 HKCU（当前用户）不需要管理员权限
:: 先删除旧的 HKCR 注册（如果存在）
reg delete "HKEY_CLASSES_ROOT\mypanel" /f 2>nul

:: 创建 HKCU 注册表项
reg add "HKCU\Software\Classes\mypanel" /ve /t REG_SZ /d "URL:mypanel Protocol" /f >nul
reg add "HKCU\Software\Classes\mypanel" /v "URL Protocol" /t REG_SZ /d "" /f >nul
reg add "HKCU\Software\Classes\mypanel\shell\open\command" /ve /t REG_SZ /d "wscript.exe \"%LAUNCHER_DIR%\launcher.vbs\" \"%%1\"" /f >nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ 协议注册成功！
    echo ========================================
    echo.
    echo 注册位置：HKEY_CURRENT_USER\Software\Classes\mypanel
    echo.
    echo 现在可以在 Personal Panel 中使用程序路径了：
    echo   - 添加项目时类型选择"程序"
    echo   - 路径填写完整的程序路径，如：
    echo     C:\Program Files\App\app.exe
    echo.
    echo 测试：按 Win+R，输入 mypanel://notepad.exe
    echo.
    echo 按任意键退出...
) else (
    echo.
    echo ❌ 注册失败，请检查系统权限
    echo.
    echo 按任意键退出...
)

pause
