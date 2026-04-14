# 前端集成指南

如何将数据同步功能集成到 Advanced Personal Panel 前端。

## 📋 步骤 1: 引入 sync.js

在 `index.html` 的 `<head>` 或 `</body>` 前添加：

```html
<!-- 数据同步模块 -->
<script src="sync.js"></script>
```

## 📋 步骤 2: 添加同步按钮到设置界面

在设置界面添加同步按钮和网络状态指示器：

```html
<!-- 设置面板中的同步区域 -->
<div class="settings-section">
  <h3>🔄 数据同步</h3>
  
  <div class="sync-status">
    <span class="network-status online"></span>
    <span id="network-text">在线</span>
  </div>
  
  <div class="sync-controls">
    <button id="sync-btn" class="btn btn-primary" onclick="PanelSync.sync()">
      立即同步
    </button>
    
    <span id="last-sync-time" class="sync-time">
      最后同步：--
    </span>
  </div>
  
  <div class="sync-notification"></div>
</div>
```

## 📋 步骤 3: 添加样式

在 CSS 文件中添加：

```css
/* 同步状态样式 */
.settings-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.sync-status {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.network-status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.network-status.online {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.network-status.offline {
  background: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

.sync-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

#sync-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

#sync-btn:hover {
  background: #2563eb;
}

#sync-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.sync-time {
  font-size: 12px;
  color: #999;
}

.sync-notification {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  display: none;
}

.sync-notification.success {
  background: #d1fae5;
  color: #065f46;
  display: block;
}

.sync-notification.error {
  background: #fee2e2;
  color: #991b1b;
  display: block;
}

.sync-notification.warning {
  background: #fef3c7;
  color: #92400e;
  display: block;
}
```

## 📋 步骤 4: 更新同步状态显示

添加 JavaScript 代码更新 UI：

```javascript
// 监听数据同步事件
window.addEventListener('data-synced', (event) => {
  console.log('数据已同步', event.detail);
  
  // 更新最后同步时间
  const status = PanelSync.getStatus();
  updateLastSyncTime(status.lastSyncTime);
  
  // 重新加载面板数据
  loadPanelData(event.detail.data);
});

// 更新最后同步时间显示
function updateLastSyncTime(timestamp) {
  const timeEl = document.getElementById('last-sync-time');
  if (timeEl && timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    let timeText;
    if (diff < 60000) {
      timeText = '刚刚';
    } else if (diff < 3600000) {
      timeText = Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) {
      timeText = Math.floor(diff / 3600000) + '小时前';
    } else {
      timeText = date.toLocaleDateString('zh-CN');
    }
    
    timeEl.textContent = '最后同步：' + timeText;
  }
}

// 加载面板数据
function loadPanelData(data) {
  if (data.personalPanelData) {
    // 重新渲染分类、网站等
    renderCategories(data.personalPanelData.categories);
    renderWebsites(data.personalPanelData.websites);
    // ...
  }
  
  if (data.today_work_data) {
    // 重新渲染任务和提醒
    renderTasks(data.today_work_data.tasks);
    // ...
  }
  
  if (data.settings) {
    // 应用设置
    applySettings(data.settings);
  }
}
```

## 📋 步骤 5: 添加登录/注册界面

在设置界面添加用户认证区域：

```html
<!-- 用户认证区域 -->
<div class="auth-section" id="auth-section">
  <h3>👤 账户同步</h3>
  
  <!-- 未登录状态 -->
  <div id="login-form" class="auth-form">
    <input type="email" id="login-email" placeholder="邮箱" class="input-field">
    <input type="password" id="login-password" placeholder="密码" class="input-field">
    <button onclick="handleLogin()" class="btn btn-primary">登录</button>
    <button onclick="showRegisterForm()" class="btn btn-secondary">注册</button>
  </div>
  
  <!-- 注册表单（默认隐藏） -->
  <div id="register-form" class="auth-form" style="display:none;">
    <input type="email" id="register-email" placeholder="邮箱" class="input-field">
    <input type="password" id="register-password" placeholder="密码（至少 6 位）" class="input-field">
    <button onclick="handleRegister()" class="btn btn-primary">注册</button>
    <button onclick="showLoginForm()" class="btn btn-secondary">返回登录</button>
  </div>
  
  <!-- 已登录状态 -->
  <div id="user-info" class="user-info" style="display:none;">
    <span id="user-email"></span>
    <button onclick="handleLogout()" class="btn btn-danger">退出登录</button>
  </div>
</div>
```

```javascript
// 处理登录
async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await PanelSync.login(email, password);
    showUserInfo();
    showNotification('登录成功', 'success');
  } catch (error) {
    showNotification('登录失败：' + error.message, 'error');
  }
}

// 处理注册
async function handleRegister() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    await PanelSync.register(email, password);
    showUserInfo();
    showNotification('注册成功', 'success');
  } catch (error) {
    showNotification('注册失败：' + error.message, 'error');
  }
}

// 处理登出
function handleLogout() {
  PanelSync.logout();
  showLoginForm();
}

// 显示用户信息
function showUserInfo() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  
  const status = PanelSync.getStatus();
  if (status.isLoggedIn) {
    // 从 localStorage 获取邮箱
    const token = localStorage.getItem('panel_token');
    if (token) {
      // 解码 JWT 获取邮箱（或使用 API 获取）
      const payload = JSON.parse(atob(token.split('.')[1]));
      document.getElementById('user-email').textContent = payload.email;
    }
  }
}

// 显示登录表单
function showLoginForm() {
  document.getElementById('login-form').style.display = 'flex';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('user-info').style.display = 'none';
}

// 显示注册表单
function showRegisterForm() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'flex';
  document.getElementById('user-info').style.display = 'none';
}

// 初始化认证状态
function initAuth() {
  if (PanelSync.isLoggedIn()) {
    showUserInfo();
  } else {
    showLoginForm();
  }
}
```

## 📋 步骤 6: 配置 API 地址

修改 `sync.js` 中的 API 地址为你的后端部署 URL：

```javascript
const SYNC_CONFIG = {
  API_URL: 'https://your-backend.vercel.app/api'
  // 或
  // API_URL: 'https://your-project.railway.app/api'
};
```

或者在页面加载时动态设置：

```javascript
// 在生产环境中自动使用云端 API
if (window.location.hostname !== 'localhost') {
  PanelSync.setApiUrl('https://your-backend.vercel.app/api');
}
```

## 📋 步骤 7: 页面加载时自动同步

在页面初始化时检查并同步数据：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 初始化同步模块（sync.js 会自动执行）
  
  // 如果已登录，自动同步数据
  setTimeout(() => {
    if (PanelSync.isLoggedIn()) {
      PanelSync.sync().then(success => {
        if (success) {
          const data = PanelSync.getData();
          loadPanelData(data);
        }
      });
    } else {
      // 未登录，使用本地数据
      const data = PanelSync.getData();
      loadPanelData(data);
    }
  }, 1000);
});
```

## 📋 步骤 8: 处理数据冲突

当检测到数据冲突时，提示用户选择：

```javascript
// 在 sync.js 中修改冲突处理
async function sync() {
  // ... 现有代码 ...
  
  if (result.data.conflict) {
    showConflictDialog(result.data);
  }
}

// 显示冲突对话框
function showConflictDialog(cloudData) {
  const localData = PanelSync.getData();
  
  const confirmed = confirm(
    '检测到数据冲突！\n\n' +
    '云端数据和本地数据不一致。\n' +
    '点击"确定"使用云端数据，\n' +
    '点击"取消"保留本地数据。'
  );
  
  if (confirmed) {
    // 使用云端数据
    PanelSync.setData(cloudData);
    loadPanelData(cloudData);
    showNotification('已使用云端数据', 'success');
  } else {
    // 保留本地数据，重新上传
    PanelSync.sync();
    showNotification('已保留本地数据', 'info');
  }
}
```

## ✅ 集成检查清单

- [ ] 在 index.html 中引入 sync.js
- [ ] 添加同步按钮到设置界面
- [ ] 添加 CSS 样式
- [ ] 添加登录/注册表单
- [ ] 配置正确的 API 地址
- [ ] 测试登录/注册功能
- [ ] 测试数据同步功能
- [ ] 测试离线模式
- [ ] 测试网络恢复自动同步

## 🎯 完整示例

查看 `examples/` 目录中的完整集成示例代码。

---

## 📞 支持

如有问题，请参考：
- [后端 API 文档](./backend/README.md)
- [部署指南](./backend/DEPLOY.md)
