# 📝 修改日志 - Changelog

---

## 🌶️ 2026-04-12 - 功能完善与优化

### ✨ 新增功能

#### 1. 拖拽功能增强
- ✅ **同一分类内网站排序** - 详情页内拖拽重新排序
- ✅ **跨分类移动** - 网站/程序/目录拖到其他分类
- ✅ **拖到侧边栏** - 从详情页拖到侧边栏分类卡片
- ✅ **预览线指示** - 蓝色渐变线显示插入位置（顶部/底部）
- ✅ **拖拽状态检测** - 防止拖拽后误触发点击
- ✅ **空分类处理** - 最后一个项目拖走后自动关闭详情页

#### 2. 路径处理优化
- ✅ **自动去引号** - 保存时自动去除首尾双引号
- ✅ **拖拽去引号** - 拖拽添加时自动去除引号
- ✅ **Windows 路径识别** - 自动识别 `C:\` 格式路径
- ✅ **file:// 协议转换** - 自动转换为 Windows 路径

#### 3. 国际化完善
- ✅ **添加分类模态框** - 完整中英文翻译
- ✅ **编辑分类模态框** - 完整中英文翻译
- ✅ **添加网站模态框** - 完整中英文翻译
- ✅ **编辑网站模态框** - 完整中英文翻译
- ✅ **详情页添加按钮** - 中英文切换
- ✅ **表单标签翻译** - 所有表单标签支持多语言
- ✅ **占位符翻译** - 输入框占位符支持多语言
- ✅ **按钮翻译** - 取消/保存按钮支持多语言

#### 4. 界面显示优化
- ✅ **长名称换行** - 详情页网站名称自动换行（最多 2 行）
- ✅ **长简介换行** - 网站简介自动换行（最多 2 行）
- ✅ **侧边栏单行** - 预览名称保持单行，超出省略号
- ✅ **固定高度** - 侧边栏网站项固定 36px 高度

### 🔧 技术改进

#### 1. 拖拽架构重构
```javascript
// 新增：同一分类内排序
reorderWebInCat(catId, targetWebId, webId, position)

// 增强：handleWebDrop 判断逻辑
if (targetCatId === draggedWebCatId) {
    reorderWebInCat()  // 同分类排序
} else {
    moveWebToCat()     // 跨分类移动
}

// 新增：拖拽状态标志
let isDragging = false

// 新增：点击拦截
handleWebClick(event, url, type) {
    if (isDragging) {
        event.preventDefault()
        event.stopPropagation()
        return
    }
    openUrl(url, type)
}
```

#### 2. 拖拽事件完善
```javascript
// 新增 dragenter 处理器
handleWebDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
}

// 增强 dragover 处理器
handleWebDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    // 计算鼠标位置决定预览线位置
}
```

#### 3. 国际化函数
```javascript
// 新增：模态框标签更新
updateWebModalLabels(lang)

// 增强：分类模态框
openCatModal(zone) - 支持语言参数
editCat(catId, zone) - 支持语言参数

// 增强：网站模态框
openWebModal() - 支持语言参数
editWeb(webId) - 支持语言参数
openWebModalWithAutoFill(name, url, type) - 支持语言参数

// 增强：类型切换
toggleWebType(lang) - 支持语言参数
```

#### 4. 页面语言更新
```javascript
updatePageLanguage(lang) {
    // 新增：更新详情页添加按钮
    const addWebBtn = document.getElementById('addWebBtn')
    if (addWebBtn) {
        addWebBtn.textContent = lang === 'en' 
            ? '+ Add Website' 
            : '+ 添加网站'
    }
    
    // 增强：分类详情打开时更新
    selectCat(cat, zone) {
        const lang = localStorage.getItem('panelLanguage')
        // 更新分类名称
        // 更新添加按钮文字
    }
}
```

### 🎨 界面优化

#### 1. 网站卡片样式
```css
.web-card .web-name {
    word-break: break-word;      /* 单词内换行 */
    overflow-wrap: break-word;   /* 长词换行 */
    white-space: normal;         /* 允许换行 */
    line-height: 1.3;
    max-height: 2.6em;           /* 最多 2 行 */
    overflow: hidden;
}

.web-card .web-desc {
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    max-height: 2.6em;
    overflow: hidden;
}
```

#### 2. 侧边栏预览样式
```css
.web-item {
    height: 36px;                /* 固定高度 */
    overflow: hidden;
    align-items: center;         /* 垂直居中 */
}

.web-name {
    overflow: hidden;
    text-overflow: ellipsis;     /* 超出省略号 */
    white-space: nowrap;         /* 不换行 */
}
```

### 📋 代码质量
- ✅ JavaScript 语法验证通过
- ✅ HTML 标签平衡检查
- ✅ 无重复函数定义
- ✅ 事件处理器正确绑定
- ✅ 调试日志完善

---

## 🌶️ 2026-04-11 - 拖拽功能与界面优化

### ✨ 新增功能

#### 1. 分类卡片拖拽增强
- ✅ **预览线指示** - 拖拽时显示蓝色渐变预览线
- ✅ **位置指示** - 鼠标位置决定插入到顶部/底部
- ✅ **即时清理** - 拖拽结束自动清理预览线
- ✅ **无动画延迟** - 预览线即时跟随鼠标

#### 2. 今日工作四象限拖拽
- ✅ **任务拖拽** - 支持四象限内拖拽排序
- ✅ **跨象限拖拽** - 支持任务跨象限移动
- ✅ **空象限接收** - 支持拖到空象限
- ✅ **类型自动更新** - 跨象限拖拽自动更新任务类型
- ✅ **预览线指示** - 显示插入位置

#### 3. 详情页优化
- ✅ **关闭按钮** - 添加×按钮快速关闭详情页
- ✅ **按钮布局** - 右上角按钮组紧凑排列
- ✅ **边距统一** - 上下左右边距保持一致（1rem）
- ✅ **顶部间距** - 优化详情页顶部间距

#### 4. 中英文切换优化
- ✅ **分类名称刷新** - 切换时分类名称立即刷新
- ✅ **详情页标题刷新** - 详情页分类名立即刷新
- ✅ **网站名称刷新** - 网站名称立即刷新
- ✅ **强制语言参数** - 支持传入语言参数确保即时刷新

### 🎨 界面优化

#### 1. 边距调整
- 详情页上下边距：0.75rem → 1rem
- 详情页左右边距：统一为 1rem（侧边栏展开时 320px）
- 四边距保持一致，视觉更统一

#### 2. 详情页头部
- `margin-bottom`: 1.5rem → 1rem
- `padding-bottom`: 1rem → 0.75rem
- `gap`: 1rem → 0.75rem
- 添加 `.detail-actions` 容器，按钮组更紧凑

#### 3. 关闭按钮样式
- 圆形设计（36px × 36px）
- 灰色背景，悬停变红
- 字体大小 1.3rem
- 与添加按钮并排显示

---

## 🌶️ 2026-04-05 - 协议处理器与分类优化

### ✨ 新增功能

#### 1. 协议处理器
- ✅ **自定义协议** - `mypanel://` 协议注册
- ✅ **本地程序启动** - 直接从面板启动 Windows 程序
- ✅ **目录打开** - 直接打开 Windows 文件夹
- ✅ **安装脚本** - `install.bat` 一键安装
- ✅ **注册表文件** - `register.reg` 备用安装

#### 2. 三种类型支持
- ✅ **网址类型** - 🌐 传统网站链接
- ✅ **程序类型** - 🖥️ Windows 可执行程序
- ✅ **目录类型** - 📁 Windows 文件夹

#### 3. 双区域分类
- ✅ **办公区** - 左侧侧边栏
- ✅ **休闲区** - 右侧侧边栏
- ✅ **分类选择器** - 添加网站时可选择任意分类

### 🎨 UI 优化

#### 1. 类型徽章
- ✅ 网站卡片显示类型图标（🌐/🖥️/📁）
- ✅ 右上角位置，不遮挡内容
- ✅ 视觉区分不同类型

#### 2. 动态分类选择器
- ✅ 添加网站时显示所有分类
- ✅ 显示分类图标和名称
- ✅ 默认选中当前分类

#### 3. 路径格式处理
- ✅ 支持绝对路径：`C:\Program Files\App\app.exe`
- ✅ 支持 file 协议：`file:///C:/Program Files/App/app.exe`
- ✅ 支持带空格路径：`C:\Program Files\My App\app.exe`
- ✅ 自动转换路径格式

---

## 📊 功能完成度

### 核心功能
- [x] 双主题切换（深色/浅色）
- [x] 7 种主题色
- [x] 双区域分类管理
- [x] 分类拖拽排序
- [x] 网站/程序/目录管理
- [x] 拖拽添加（从桌面）
- [x] 网站拖拽排序
- [x] 跨分类拖拽
- [x] 今日工作四象限
- [x] 任务拖拽排序
- [x] 提醒系统
- [x] 安全锁定
- [x] 中英文切换
- [x] 数据导出/导入
- [x] 协议处理器

### 界面优化
- [x] 响应式布局
- [x] 侧边栏自动隐藏
- [x] 侧边栏锁定
- [x] 长名称换行
- [x] 拖拽预览线
- [x] 模态框国际化

---

## 🎯 已知问题

暂无

## 📝 备注

- 所有数据保存在 localStorage
- 拖拽功能需要现代浏览器支持
- 程序启动功能仅在 Windows 有效
- 首次点击程序需允许浏览器打开应用
- 浏览器安全限制无法获取拖拽文件完整路径（需手动输入）

---

🌶️ **花椒（Huājiāo） | 过程省略，只看结果**
