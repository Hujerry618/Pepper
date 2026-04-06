@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   Personal Panel 协议处理器卸载程序
echo ========================================
echo.

echo 正在删除 mypanel:// 协议注册...
echo.

reg delete HKEY_CLASSES_ROOT\mypanel /f

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 协议已删除！
    echo.
    echo Personal Panel 将无法再直接启动本地程序。
    echo 如需重新启用，请运行 install.bat 重新安装。
    echo.
    echo 按任意键退出...
) else (
    echo.
    echo ❌ 删除失败，请以管理员身份运行此脚本
    echo.
    echo 按任意键退出...
)

pause >nul
