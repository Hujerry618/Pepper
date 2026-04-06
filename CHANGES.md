# 修改日志 - 2026-04-05

## 🚀 最新修改（22:16）- 自定义协议处理器

### 📋 方案 1：mypanel:// 协议处理器（推荐）⭐

**新增文件：**
```
launcher/
├── install.bat          # 一键安装脚本（管理员权限）
├── uninstall.bat        # 卸载脚本
├── launcher.vbs         # 协议处理器核心
├── register.reg         # 注册表文件（备用）
├── test.html            # 协议测试页面
└── README.md            # 详细使用说明
```

**功能特性：**
- ✅ 注册自定义协议 `mypanel://` 到 Windows 系统
- ✅ 点击程序卡片直接启动本地程序，无需下载脚本
- ✅ 支持程序文件（.exe 等）和目录路径
- ✅ 自动处理路径格式转换（Windows 路径 ↔ file:///）
- ✅ 一键安装/卸载

**安装步骤：**
1. 以管理员身份运行 `launcher/install.bat`
2. 测试：按 `Win+R` 输入 `mypanel://notepad.exe` 应打开记事本
3. 在 Personal Panel 中添加程序，类型选择"程序"，填写完整路径

**使用示例：**
- 程序：`C:\Program Files\Google\Chrome\Application\chrome.exe`
- 目录：`C:\Users\YourName\Documents`
- 系统工具：`C:\Windows\System32\notepad.exe`

---

## 🎯 修改内容

### 3. 🏷️ 场景分类优化
- **左侧场景**：更名为"🖥️ 办公场景"（原"💼 工作区"）
- **右侧场景**：更名为"🎮 休闲场景"（原"🎮 休闲区"）
- **新增分类按钮**：两个场景标题栏右侧都有"➕"按钮
- **分类归属**：
  - 左侧"➕"添加的分类 → 显示在左侧办公场景
  - 右侧"➕"添加的分类 → 显示在右侧休闲场景
- **动态分类选择**：添加网站时，分类选择器动态加载所有分类（包括新增的自定义分类）

### 4. 🎨 UI 优化
- **类型徽章**：程序和目录类型的卡片显示类型徽章（"程序"或"目录"）
- **类型图标**：卡片图标前显示对应类型图标（🖥️ / 📁）
- **类型提示**：添加网站时显示对应类型的提示信息

## 📝 使用说明

### 添加程序
1. 点击分类卡片上的"➕"按钮
2. 选择"🖥️ 程序（Windows）"类型
3. 填写程序名称和路径（如：`C:\Program Files\App\app.exe`）
4. 选择分类（可以是任意左侧或右侧的分类）
5. 保存

### 添加目录
1. 点击分类卡片上的"➕"按钮
2. 选择"📁 目录（Windows）"类型
3. 填写目录名称和路径（如：`C:\Users\YourName\Documents`）
4. 选择分类
5. 保存

### 新增分类
1. 点击左侧或右侧场景标题栏的"➕"按钮
2. 输入分类名称和选择图标
3. 保存
4. **左侧按钮**添加的分类显示在左侧办公场景
5. **右侧按钮**添加的分类显示在右侧休闲场景

### 添加网站到新增分类
1. 点击任意分类卡片上的"➕"按钮
2. 在"分类"下拉框中选择所有分类（包括新增的自定义分类）
3. 选择对应的分类后保存即可

## 🔧 技术细节

### 修改的文件
- `C:\Users\Administrator\.openclaw\workspace\apps\personal-panel\index.html`（单文件应用）

### 关键函数修改
- `openCatModal(zone)` - 传递 zone 参数（left/right）
- `saveCat()` - 根据 zone 添加到 appData.left 或 appData.right
- `openWebModal()` - 动态加载所有分类到选择器
- `saveWeb()` - 从动态选择器获取分类 ID，在 left 和 right 中查找分类
- `openWeb(url, type)` - 根据类型打开网站/程序/目录
- `toggleWebType()` - 根据类型切换输入框和提示信息
- `renderSidebar()` - 渲染类型徽章和图标

### 数据结构
```javascript
// 分类对象新增 side 属性（可选）
{
    id: 'custom-xxx',
    name: '分类名',
    icon: '📁',
    websites: [...],
    side: 'left' | 'right'  // 可选，用于记录归属
}

// 网站对象新增 type 属性
{
    id: 'web-xxx',
    name: '名称',
    url: 'url 或 file:// 路径',
    icon: '图标',
    desc: '描述',
    type: 'url' | 'app' | 'dir'
}
```

### 路径处理
Windows 路径会自动转换为 `file:///` 协议格式：
- 输入：`C:\Program Files\App\app.exe`
- 转换：`file:///C:/Program Files/App/app.exe`

## ⚠️ 注意事项

### 协议处理器方案（推荐）
- ✅ 需要运行 `launcher/install.bat` 安装（管理员权限）
- ✅ 首次点击程序时浏览器可能提示「此网站试图打开 xxx」，选择**允许**
- ✅ 安装后可在 Personal Panel 中直接点击程序卡片启动
- ✅ 使用 `launcher/test.html` 测试协议是否正常工作

### 旧版 VBS 方案（已废弃）
- ❌ 需要手动下载并运行 VBS 脚本
- ❌ 体验不流畅，已替换为协议处理器方案

### 通用说明
- 程序和目录功能仅在 Windows 系统下有效
- "管理员模式"依赖 Windows UAC 提示，浏览器无法直接控制权限
- 建议仅添加可信程序路径
