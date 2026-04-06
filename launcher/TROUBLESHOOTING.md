# 🔧 故障排查指南

## 问题：点击程序卡片没反应

### 原因分析

1. **旧数据问题** - 微信卡片是添加的，可能没有 `type` 字段
2. **浏览器阻止** - 首次使用协议时浏览器会提示
3. **协议未安装** - 注册表配置不正确

---

## ✅ 解决方案（按顺序执行）

### 方案 1：自动修复（推荐）⭐

**刷新 Personal Panel 页面**（按 F5）

页面会自动：
1. 检测旧数据（Windows 路径但没有 type 字段）
2. 自动添加 `type: 'app'`
3. 弹出提示「已自动修复」

**然后再次点击微信卡片**

---

### 方案 2：使用诊断工具

1. 打开 `launcher/diagnose.html`（双击或用浏览器打开）
2. 点击「加载数据」查看当前所有项目
3. 点击「修复旧数据」自动修复
4. 点击「测试记事本」验证协议是否正常

---

### 方案 3：手动编辑微信卡片

1. 在 Personal Panel 中点击「开发类」
2. 鼠标悬停在微信卡片上
3. 点击 ✏️ 编辑按钮
4. 确认类型选择的是 **「🖥️ 程序」**
5. 保存
6. 再次点击微信卡片

---

### 方案 4：检查浏览器控制台

1. 在 Personal Panel 页面按 `F12` 打开开发者工具
2. 切换到 **Console（控制台）** 标签
3. 点击微信卡片
4. 查看是否有日志输出：
   ```
   [openUrl] 调用参数：{url: "C:\...", type: "app"}
   [openUrl] 启动程序：C:\...
   [openUrl] 协议 URL: mypanel://file:///C:/...
   ```

**如果有日志但程序没启动** → 协议问题
**如果没有任何日志** → 点击事件没触发（可能是卡片问题）

---

### 方案 5：验证协议安装

**方法 1：Win+R 测试**
1. 按 `Win + R`
2. 输入：`mypanel://notepad.exe`
3. 回车

**✅ 如果记事本打开了** → 协议正常
**❌ 如果没反应** → 协议未正确安装

**方法 2：检查注册表**
1. 按 `Win + R`
2. 输入：`regedit`
3. 导航到：`HKEY_CLASSES_ROOT\mypanel\shell\open\command`
4. 确认默认值为：
   ```
   wscript.exe C:\Users\Administrator\.openclaw\workspace\apps\personal-panel\launcher\launcher.vbs %1
   ```

---

## 📋 微信常见路径

如果微信路径不正确，尝试以下常见路径：

| 位置 | 路径 |
|------|------|
| 默认安装 | `C:\Program Files (x86)\Tencent\WeChat\WeChat.exe` |
| 用户目录 | `C:\Users\你的用户名\AppData\Local\Programs\Tencent\WeChat\WeChat.exe` |
| 自定义 | `D:\Program Files\Tencent\WeChat\WeChat.exe` |

**查找微信实际位置：**
1. 在桌面微信图标上右键
2. 选择「属性」
3. 复制「目标」字段中的完整路径

---

## 🆘 还是不行？

### 终极测试

1. 打开 `launcher/test.html`
2. 点击「测试记事本」
3. 如果记事本打开了 → 协议正常，问题在 Personal Panel 数据
4. 如果没打开 → 协议安装有问题

### 重新安装协议

1. 以管理员身份运行 `launcher/uninstall.bat`（卸载）
2. 以管理员身份运行 `launcher/install.bat`（重新安装）
3. 刷新 Personal Panel 页面
4. 再次测试

---

## 📖 相关文件

- `install.bat` - 安装脚本
- `uninstall.bat` - 卸载脚本
- `launcher.vbs` - 协议处理器
- `diagnose.html` - 诊断工具
- `test.html` - 快速测试
- `README.md` - 使用说明
- `QUICKSTART.md` - 快速指南
