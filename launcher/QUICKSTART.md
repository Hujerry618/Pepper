# 🚀 快速启动指南

## 3 分钟完成安装

### 步骤 1/3：安装协议处理器（1 分钟）

1. 打开文件夹 `apps/personal-panel/launcher/`
2. **右键** `install.bat` → **以管理员身份运行**
3. 看到 `✅ 协议注册成功！` 提示

### 步骤 2/3：测试协议（30 秒）

1. 按 `Win + R` 打开运行对话框
2. 输入：`mypanel://notepad.exe`
3. 按回车 → 应打开记事本

**✅ 如果记事本打开了** → 协议工作正常，继续步骤 3

**❌ 如果没反应** → 重新运行 install.bat，或检查 Windows Defender 是否拦截

### 步骤 3/3：添加第一个程序（1 分钟）

1. 打开 Personal Panel（`index.html`）
2. 点击任意分类卡片（如"🖥️ 办公场景"下的分类）
3. 点击右上角「+ 添加网站」
4. 类型选择：**🖥️ 程序（Windows）**
5. 填写：
   - 名称：`记事本`
   - 路径：`C:\Windows\System32\notepad.exe`
   - 图标：📝
6. 点击保存
7. **点击刚添加的记事本卡片** → 应直接打开记事本程序

---

## 🎉 完成！

现在可以添加任意程序了：

| 程序 | 路径示例 |
|------|---------|
| Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| VS Code | `C:\Users\你的用户名\AppData\Local\Programs\Microsoft VS Code\Code.exe` |
| 微信 | `C:\Program Files (x86)\Tencent\WeChat\WeChat.exe` |
| 资源管理器 | `C:\Windows\explorer.exe` |
| 计算器 | `C:\Windows\System32\Calculator.exe` |

---

## 💡 高级技巧

### 添加文件夹快捷方式
- 类型选择：**📁 目录（Windows）**
- 路径：`C:\Users\你的用户名\Documents`

### 快速找到程序路径
1. 在桌面程序快捷方式上**右键**
2. 选择**属性**
3. 复制"目标"字段中的完整路径

### 测试页面
打开 `launcher/test.html` 可以测试协议是否正常工作。

---

## ❓ 常见问题

**Q: 点击程序卡片浏览器提示「此网站试图打开 xxx」**
A: 这是正常的安全提示，选择「允许」即可。可在浏览器设置中添加例外。

**Q: 点击后没有任何反应**
A: 
1. 检查协议是否安装成功（Win+R 测试 `mypanel://notepad.exe`）
2. 检查程序路径是否正确
3. 重新运行 `install.bat`

**Q: 如何卸载协议？**
A: 运行 `launcher/uninstall.bat`（管理员权限）

---

**📖 详细文档：** 查看 `README.md`
