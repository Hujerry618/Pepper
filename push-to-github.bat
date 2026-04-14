@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🌶️ Advanced Personal Panel - 推送到 GitHub
echo ========================================
echo.
echo 仓库：https://github.com/hujerry618/advanced-personal-panel
echo.
echo 请在弹出的窗口中输入 GitHub 密码或 Token
echo (勾选"记住凭据"以后就不用再输入了)
echo.
pause
echo.
echo 开始推送...
echo.

cd /d "%~dp0"

REM 使用 Git 凭据管理器
git config --global credential.helper wincred

REM 推送代码
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ 推送成功！
    echo ========================================
    echo.
    echo 🎉 项目已上传到 GitHub!
    echo.
    echo 访问仓库：https://github.com/hujerry618/advanced-personal-panel
    echo.
    echo 下一步:
    echo 1. 访问上面的链接查看你的代码
    echo 2. 在仓库 Settings ^→ Pages 中启用 GitHub Pages
    echo 3. 访问你的在线面板：https://hujerry618.github.io/advanced-personal-panel/
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ 推送失败
    echo ========================================
    echo.
    echo 可能原因:
    echo 1. 密码或 Token 错误
    echo 2. 仓库不存在 (需要先在 GitHub 创建)
    echo 3. 网络连接问题
    echo.
    echo 解决方法:
    echo 1. 创建仓库：https://github.com/new
    echo    仓库名：advanced-personal-panel
    echo    设为 Public 或 Private 都可以
    echo.
    echo 2. 使用 Token 而不是密码:
    echo    https://github.com/settings/tokens
    echo    生成 Token 时勾选 repo 权限
    echo.
    echo 3. 检查网络连接
    echo.
)

echo 按任意键关闭窗口...
pause >nul
