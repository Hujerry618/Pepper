# 查找微信实际路径并修复 Personal Panel 数据

Write-Host "🔍 正在查找微信安装路径..." -ForegroundColor Cyan

$possiblePaths = @(
    "C:\Program Files (x86)\Tencent\WeChat\WeChat.exe",
    "C:\Program Files\Tencent\WeChat\WeChat.exe",
    "$env:LOCALAPPDATA\Programs\Tencent\WeChat\WeChat.exe",
    "D:\Program Files (x86)\Tencent\WeChat\WeChat.exe",
    "D:\Program Files\Tencent\WeChat\WeChat.exe"
)

$wechatPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "✅ 找到微信：$path" -ForegroundColor Green
        $wechatPath = $path
        break
    }
}

if (-not $wechatPath) {
    Write-Host "❌ 未找到微信，请手动指定路径" -ForegroundColor Red
    Write-Host "常见位置："
    Write-Host "  C:\Program Files (x86)\Tencent\WeChat\WeChat.exe"
    Write-Host "  $env:LOCALAPPDATA\Programs\Tencent\WeChat\WeChat.exe"
    exit 1
}

# 读取 Personal Panel 数据
$dataFile = "$env:APPDATA\..\Local\Microsoft\Edge\User Data\Default\Local Storage\leveldb"
# 实际上我们无法直接修改浏览器的 localStorage，需要用户自己在页面中修复

Write-Host ""
Write-Host "📋 微信路径：" -ForegroundColor Cyan
Write-Host $wechatPath -ForegroundColor Yellow
Write-Host ""
Write-Host "请在 Personal Panel 中：" -ForegroundColor Cyan
Write-Host "1. 点击编辑微信卡片" -ForegroundColor White
Write-Host "2. 类型选择：🖥️ 程序" -ForegroundColor White
Write-Host "3. 路径填写：$wechatPath" -ForegroundColor White
Write-Host "4. 保存" -ForegroundColor White
Write-Host ""
Write-Host "按任意键复制路径到剪贴板..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 复制路径到剪贴板
$wechatPath | Set-Clipboard
Write-Host "✅ 路径已复制到剪贴板" -ForegroundColor Green
