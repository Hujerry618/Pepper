# Personal Panel 协议处理器

## 功能说明

通过注册自定义协议 `mypanel://`，实现从浏览器直接启动 Windows 本地程序。

## 安装步骤

### 1. 运行安装程序

双击 `install.bat`（或以管理员身份运行）

安装后会注册 `mypanel://` 协议到 Windows 系统。

### 2. 验证安装

按 `Win + R`，输入 `mypanel://notepad.exe` 测试是否打开记事本。

## 使用方法

### 在 Personal Panel 中添加程序

1. 点击侧边栏分类卡片
2. 点击「+ 添加网站」
3. 类型选择 **「程序」**
4. 路径填写完整程序路径，例如：
   - `C:\Program Files\Google\Chrome\Application\chrome.exe`
   - `D:\Tools\VSCode\Code.exe`
   - `C:\Windows\System32\notepad.exe`

### 路径格式

- ✅ 绝对路径：`C:\Program Files\App\app.exe`
- ✅ file 协议：`file:///C:/Program Files/App/app.exe`
- ✅ 带空格路径：`C:\Program Files\My App\app.exe`

## 技术原理

1. **注册表注册** - 在 `HKEY_CLASSES_ROOT\mypanel` 下创建协议定义
2. **协议处理器** - `launcher.vbs` 接收协议调用，解析路径并执行程序
3. **浏览器调用** - 网页中使用 `window.location.href = 'mypanel://路径'` 触发

## 卸载

运行以下命令删除协议注册：

```batch
reg delete HKEY_CLASSES_ROOT\mypanel /f
```

## 安全说明

- 协议处理器仅执行本地文件，不会下载或执行网络内容
- 建议仅添加可信程序路径
- 安装程序需要管理员权限

## 故障排除

### 点击程序卡片无反应

1. 检查协议是否正确注册（运行 `mypanel://notepad.exe` 测试）
2. 检查程序路径是否正确（复制路径到资源管理器地址栏测试）
3. 重新运行 `install.bat` 安装

### 提示「此网站试图打开 xxx」

这是浏览器的安全提示，选择「允许」即可。可在浏览器设置中为本地文件添加例外。

## 文件清单

```
launcher/
├── install.bat      # 安装脚本（运行此文件）
├── launcher.vbs     # 协议处理器
├── register.reg     # 注册表文件（备用）
└── README.md        # 说明文档
```
