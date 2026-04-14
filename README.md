# 🌶️ Advanced Personal Panel

> **您的专属导航中心 · 高效从这里开始**  
> *Your Personal Navigation Center · Efficiency Starts Here*

[![Version](https://img.shields.io/badge/version-v1.0-blue.svg)](https://github.com/hujerry618/advanced-personal-panel)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Pure Frontend](https://img.shields.io/badge/pure-frontend-orange.svg)](https://github.com/hujerry618/advanced-personal-panel)

---

## 📖 项目简介

**Advanced Personal Panel** 是一款高端个人导航面板，集成网站管理、本地程序启动、任务管理、提醒系统于一体。采用纯前端单文件设计，开箱即用，无需后端服务。

### 🎯 核心特性

| 特性 | 说明 |
|------|------|
| 🎨 **界面定制** | 双主题 + 7 种主题色，响应式布局 |
| 🗂️ **分类管理** | 双区域设计（办公/休闲），拖拽排序 |
| 🌐 **多类型支持** | 网址 🌐 / 程序 🖥️ / 目录 📁 |
| 📋 **今日工作** | 艾森豪威尔四象限任务管理 |
| ⚠️ **提醒系统** | 定时检查 + 弹窗通知 + 稍后提醒 |
| 🔒 **安全锁定** | 定时自动锁定 + 4 位密码保护 |
| 🌐 **国际化** | 中英文完整切换 |
| 📤 **数据管理** | 导出/导入/备份/恢复 |

---

## 🚀 快速开始

### 方法一：直接打开（推荐）
```bash
# 双击 index.html 即可在浏览器中运行
```

### 方法二：本地服务器
```bash
# Python
cd apps/personal-panel
python -m http.server 8080

# Node.js
npx serve .

# 访问 http://localhost:8080
```

### 方法三：部署到 Web
- GitHub Pages
- Vercel
- Netlify
- IIS/Apache/Nginx

---

## 📸 功能预览

### 主界面
- 左侧办公区 + 右侧休闲区
- 中央今日工作四象限
- 侧边栏悬停显示/移出隐藏

### 今日工作四象限
```
        紧急
        ↑
  ┌─────┼─────┐
  │ ⚡  │ 🔥  │ 重要
  │ 轻  │ 重  │
  ├─────┼─────┤
  │ 📝  │ 🎯  │
  │ 轻  │ 重  │
  └─────┼─────┘
        ↓
       不紧急
```

| 象限 | 类型 | 说明 |
|------|------|------|
| 🔥 **重要·急** | 今日必须完成 | 红色高亮，最高优先级 |
| 🎯 **重要·缓** | 核心任务 | 蓝色标识，重要但不紧急 |
| ⚡ **紧急·轻** | 高优工作 | 橙色标识，紧急但不重要 |
| 📝 **轻·缓** | 常规工作 | 灰色标识，日常事务 |

---

## 🎨 界面定制

### 主题切换
- 🌙 **深色模式** - 护眼夜间模式
- ☀️ **浅色模式** - 清爽日间模式

### 主题色
| 颜色 | 预览 |
|------|------|
| 蓝色 | 🔵 默认商务风 |
| 绿色 | 🟢 清新自然 |
| 紫色 | 🟣 优雅神秘 |
| 灰色 | ⚫ 简约专业 |
| 粉色 | 🩷 活泼可爱 |
| 橙色 | 🟠 温暖活力 |
| 玫红 | ❤️ 热情奔放 |

---

## 📋 使用说明

### 添加分类
1. 点击侧边栏顶部「+」按钮
2. 输入分类名称和图标（emoji）
3. 选择区域（办公区/休闲区）
4. 保存后即可看到新分类

### 添加网站/程序/目录
1. 点击分类卡片查看详情
2. 点击右上角「+ 添加网站」
3. 选择类型：
   - 🌐 **网址** - 输入完整 URL（如 `https://github.com`）
   - 🖥️ **程序** - 输入程序路径（如 `C:\Program Files\App\app.exe`）
   - 📁 **目录** - 输入文件夹路径（如 `D:\Projects`）
4. 填写名称、图标、简介
5. 保存后即时显示

### 拖拽操作
- **分类拖拽** - 按住分类卡片拖到目标位置
- **网站拖拽** - 详情页内拖拽排序，或拖到其他分类
- **任务拖拽** - 四象限内拖拽或跨象限调整优先级
- **拖拽添加** - 从桌面拖拽文件/网址到面板自动识别

### 安全锁定
1. 点击右上角 ⚙️ 设置
2. 设置无操作锁定时间（0-120 分钟）
3. 修改 4 位数字密码（初始密码：0000）
4. 点击「锁定」可立即锁定面板

---

## 📁 文件结构

```
personal-panel/
├── index.html              # 主程序（单文件包含所有 CSS/JS）
├── README.md               # 项目说明文档
├── CHANGES.md              # 修改日志
├── LICENSE                 # MIT 许可证
├── .gitignore              # Git 忽略文件
└── launcher/               # 协议处理器（启动本地程序）
    ├── install.bat         # 一键安装脚本（管理员运行）
    ├── launcher.ps1        # PowerShell 协议处理器
    ├── launcher.bat        # 批处理启动器
    ├── launcher.vbs        # VBScript 备用启动器
    └── README.md           # 协议处理器说明
```

---

## 🔧 技术栈

- **纯前端** - 单 HTML 文件，无需后端
- **原生 JavaScript** - 无第三方依赖
- **localStorage** - 本地数据持久化
- **CSS Variables** - 主题切换支持
- **Drag & Drop API** - 原生拖拽支持
- **自定义协议** - `mypanel://` 协议处理器

---

## 🌐 浏览器支持

| 浏览器 | 支持 | 备注 |
|--------|------|------|
| Chrome | ✅ | 推荐 |
| Edge | ✅ | 推荐 |
| Firefox | ✅ | 支持 |
| Safari | ✅ | 支持 |
| IE | ❌ | 不支持 |

---

## ⚠️ 注意事项

### 数据存储
- 所有数据保存在浏览器 `localStorage`
- 清除浏览器数据会导致数据丢失
- 定期使用「导出」功能备份数据

### 程序启动
- 首次点击程序时需允许浏览器打开应用
- 仅支持 Windows 系统
- 需要安装协议处理器（运行 `launcher/install.bat`）

### 路径获取
- 浏览器安全限制无法获取拖拽文件完整路径
- 获取路径方法：
  - 快捷方式：右键 → 属性 → 复制「目标」字段
  - 文件/文件夹：右键按住 `Ctrl+Shift+C` 复制路径

---

## 🆘 常见问题

### 点击程序/文件卡片无反应
1. 检查是否安装了协议处理器（运行 `launcher/install.bat`）
2. 测试协议：按 `Win+R`，输入 `mypanel://notepad.exe`
3. 浏览器可能提示「此网站试图打开 xxx」，选择「允许」
4. 查看调试日志：`%TEMP%\mypanel-debug.txt`

### 中文路径无法打开
1. 确认使用 PowerShell 版本（`launcher.ps1`）
2. 重新运行 `launcher/install.bat` 安装
3. 检查 PowerShell 执行策略：
   ```powershell
   Get-ExecutionPolicy
   ```
4. 如为 `Restricted`，运行：
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
   ```

### 数据丢失
1. localStorage 可能因清除浏览器数据而丢失
2. 定期使用「导出」功能备份数据
3. 导入备份可恢复数据

---

## 📝 更新日志

详细更新日志请查看 [CHANGES.md](CHANGES.md)

### v1.0 (2026-04-12)
- ✅ 拖拽功能增强（同分类排序/跨分类移动）
- ✅ 路径处理优化（自动去引号）
- ✅ 国际化完善（完整中英文翻译）
- ✅ 界面显示优化（长名称换行）

---

## 👨‍💻 开发团队

| 角色 | 名称 | 联系方式 |
|------|------|----------|
| **授权人** | Jerry.h | [@hujerry618](https://github.com/hujerry618) |
| **开发者** | 花椒 (Huājiāo) | AI Personal Assistant |

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)

```
MIT License

Copyright (c) 2026 Jerry.h

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/hujerry618/advanced-personal-panel)
- [问题反馈](https://github.com/hujerry618/advanced-personal-panel/issues)
- [OpenClaw 文档](https://docs.openclaw.ai)

---

<p align="center">
  <strong>🌶️ 过程省略，只看结果</strong>
</p>
