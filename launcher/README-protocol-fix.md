# mypanel 协议处理器修复记录

## 问题背景

微信卡片点击后显示 `mypanel://` 加乱码，系统是 Windows 11。

## 根本原因

浏览器生成的 URL 格式非标准：`mypanel://file///D:/Program%20Files/...`

**关键问题：** `file` 后面没有冒号，是 `file///` 而不是标准的 `file:///`

## 技术坑点总结

### 1. VBS 文件编码问题 ⚠️

- **Windows Script Host (wscript.exe) 不支持 UTF-8 编码的 VBS 文件**
- 中文系统必须使用 **ANSI 编码（GBK）**
- UTF-8 编码会导致：`Invalid character` 错误（代码 800A0408）

**正确做法：**
```powershell
# 用 PowerShell 创建 ANSI 编码的 VBS 文件
$vbsContent = @'
' VBS 代码内容
'@
# 注意：write 工具创建的文件默认是 UTF-8，需要手动转换
```

### 2. URL 处理顺序

**错误顺序：** 先转换 `file:///` → 再 URL 解码 ❌
- 导致 `%E5%BE%AE%E4%BF%A1` 中的 `%` 被错误处理

**正确顺序：** 先 URL 解码 → 再转换 `file:///` ✅

### 3. 浏览器 URL 格式不一致

浏览器可能生成多种格式：
- `mypanel://file:///D:/...` (标准)
- `mypanel://file://D:/...` (少一个斜杠)
- `mypanel://file///D:/...` (没有冒号) ← **微信卡片实际生成这个**
- `mypanel://file:/D:/...` (只有一个斜杠)

**解决方案：** 检查 `file` 开头，然后移除所有前导斜杠和冒号

## 最终修复代码

```vbscript
' Personal Panel Protocol Handler
' 支持中文路径和多种 URL 格式

On Error Resume Next

' URL 解码函数 - 处理中文字符
Function URLDecode(str)
    Dim i, ch, hex, decoded
    decoded = ""
    i = 1
    Do While i <= Len(str)
        ch = Mid(str, i, 1)
        If ch = "%" Then
            If i + 2 <= Len(str) Then
                hex = Mid(str, i + 1, 2)
                If IsHex(hex) Then
                    decoded = decoded & Chr(CLng("&H" & hex))
                    i = i + 3
                Else
                    decoded = decoded & ch
                    i = i + 1
                End If
            Else
                decoded = decoded & ch
                i = i + 1
            End If
        ElseIf ch = "+" Then
            decoded = decoded & " "
            i = i + 1
        Else
            decoded = decoded & ch
            i = i + 1
        End If
    Loop
    URLDecode = decoded
End Function

Function IsHex(str)
    Dim i, ch
    IsHex = True
    For i = 1 To Len(str)
        ch = Mid(str, i, 1)
        If Not ((ch >= "0" And ch <= "9") Or (ch >= "A" And ch <= "F") Or (ch >= "a" And ch <= "f")) Then
            IsHex = False
            Exit Function
        End If
    Next
End Function

' 主程序
Dim args, url, shell, fso
Set args = WScript.Arguments

If args.Count = 0 Then
    MsgBox "No parameter", 16, "mypanel"
    WScript.Quit 1
End If

url = args(0)

' 移除 mypanel:// 前缀
If Left(url, 10) = "mypanel://" Then
    url = Mid(url, 11)
End If

' URL 解码（处理中文）
url = URLDecode(url)
url = Replace(url, "%20", " ")

' 移除 file 前缀和所有前导斜杠/冒号
' 兼容：file:///, file://, file///, file:/, file: 等
If LCase(Left(url, 4)) = "file" Then
    url = Mid(url, 5)  ' 移除 "file"
    Do While Left(url, 1) = "/" Or Left(url, 1) = ":"
        url = Mid(url, 2)
    Loop
    url = Replace(url, "/", "\")
End If

' 启动程序或打开文件夹
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

If fso.FolderExists(url) Then
    shell.Run "explorer.exe """ & url & """", 1, False
ElseIf fso.FileExists(url) Then
    shell.Run """" & url & """", 1, False
Else
    MsgBox "Not found: " & url, 16, "mypanel"
    WScript.Quit 2
End If

Set shell = Nothing
Set fso = Nothing
WScript.Quit 0
```

## 注册表配置

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Classes\mypanel]
@="URL:mypanel Protocol"
"URL Protocol"=""

[HKEY_CURRENT_USER\Software\Classes\mypanel\shell\open\command]
@="wscript.exe \"C:\\Path\\To\\launcher.vbs\" \"%1\""
```

**注意：** 使用 `HKCU`（当前用户）无需管理员权限

## 调试技巧

### 文件日志法（推荐）

```vbscript
Dim fso, logFile
Set fso = CreateObject("Scripting.FileSystemObject")
Set logFile = fso.OpenTextFile("C:\path\to\debug.log", 8, True, -1)
logFile.WriteLine "Debug: " & url
logFile.Close
```

### 弹窗调试法

```vbscript
MsgBox "Debug: " & url, 64, "DEBUG"
```

## 相关文件

- `launcher.vbs` - 协议处理器（ANSI 编码）
- `register-final.reg` - 注册表配置
- `debug.log` - 调试日志（运行时生成）

## 快速测试

```powershell
# 测试记事本
cscript //nologo launcher.vbs "mypanel://file:///C:/Windows/System32/notepad.exe"

# 测试微信（带空格路径）
cscript //nologo launcher.vbs "mypanel://file:///D:/Program Files/Tencent/Weixin/Weixin.exe"
```

## 经验教训

1. **VBS 编码是第一个坑** - 先确认编码，再调试逻辑
2. **浏览器 URL 格式不可信** - 必须兼容多种变体
3. **调试用文件日志** - 比弹窗更方便，能保留完整历史
4. **URL 解码要尽早** - 在路径转换之前执行

---

**修复时间：** 2026-04-05 23:25 - 2026-04-06 00:19
**修复者：** 花椒 🌶️
