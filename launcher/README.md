# Personal Panel 协议处理器 (PowerShell 版)

## 功能说明

通过注册自定义协议 `mypanel://`，实现从浏览器直接启动 Windows 本地程序或打开文件/文件夹。

**✨ 新增支持：**
- ✅ 中文文件名/路径（如 `C:\文档\报告.docx`）
- ✅ 中文程序名（如 `C:\程序\微信.exe`）
- ✅ Windows 10/11 兼容
- ✅ UTF-8 编码完美支持

## 安装步骤

### 方法一：运行安装脚本（推荐）

1. **右键点击** `install.bat`
2. **选择** "以管理员身份运行"
3. **等待** 安装完成

安装后会自动：
- 注册 `mypanel://` 协议
- 设置 PowerShell 执行策略
- 备份旧版本 VBScript（如果有）

### 方法二：手动导入注册表

1. 编辑 `register.reg` 文件
2. 修改路径为你的实际路径
3. 双击运行导入注册表

## 使用方法

### 在 Personal Panel 中添加文件/程序

1. 点击侧边栏分类卡片
2. 点击「+ 添加网站」
3. 类型选择：
   - **🌐 网址** - 网站链接
   - **🖥️ 程序** - 可执行程序（.exe, .bat 等）
   - **📄 文件** - 文档文件（.docx, .xlsx, .pdf 等）
   - **📁 目录** - 文件夹
4. 路径填写完整路径，例如：
   - `C:\Users\你的用户名\Documents\报告.docx`
   - `D:\工作\项目\预算.xlsx`
   - `C:\Program Files\Tencent\WeChat\WeChat.exe`

### 测试安装

按 `Win + R`，输入：
```
mypanel://notepad.exe
```

应该打开记事本。

## 技术原理

1. **协议注册** - 在注册表 `HKEY_CLASSES_ROOT\mypanel` 下创建协议定义
2. **PowerShell 处理器** - `launcher.ps1` 接收协议调用，解码 URL，执行文件
3. **浏览器调用** - 网页中使用 `window.location.href = 'mypanel://路径'` 触发

### 为什么用 PowerShell？

| 特性 | VBScript | PowerShell |
|------|----------|------------|
| UTF-8 支持 | ❌ 差 | ✅ 完美 |
| 中文路径 | ❌ 乱码 | ✅ 正常 |
| Win11 兼容 | ⚠️ 有问题 | ✅ 完全兼容 |
| 错误处理 | ⚠️ 基础 | ✅ 完善 |
| 调试日志 | ⚠️ 简单 | ✅ 详细 |

## 文件清单

```
launcher/
├── install.bat       # 安装脚本（管理员运行）
├── launcher.ps1      # PowerShell 协议处理器（核心）
├── register.reg      # 注册表文件（备用）
├── README.md         # 说明文档
└── launcher.vbs.bak  # 旧版 VBScript 备份（如果有）
```

## 卸载

运行以下命令删除协议注册：

```batch
reg delete HKEY_CLASSES_ROOT\mypanel /f
```

## 调试

### 查看日志

安装后每次打开文件/程序都会记录日志：

```
%TEMP%\mypanel-debug.txt
```

日志包含：
- 接收到的原始 URL
- 处理后的路径
- 文件/文件夹是否存在
- 执行的操作

### 常见问题

**Q: 点击无反应**
- 检查协议是否安装：运行 `mypanel://notepad.exe` 测试
- 检查路径是否正确
- 查看调试日志

**Q: 中文路径乱码**
- 确认使用 PowerShell 版本（`launcher.ps1`）
- 重新运行 `install.bat` 安装

**Q: PowerShell 执行策略错误**
- 安装脚本会自动设置执行策略
- 手动设置：`powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"`

**Q: 浏览器提示"此网站试图打开 xxx"**
- 这是正常的安全提示
- 选择"允许"即可
- 可在浏览器设置中添加例外

## 安全说明

- 协议处理器仅执行本地文件，不会下载或执行网络内容
- 建议仅添加可信程序路径
- 安装程序需要管理员权限
- PowerShell 脚本已签名，可安全执行

---

🌶️ 花椒（Huājiāo）| 过程省略，只看结果
