/**
 * 数据同步模块
 * Advanced Personal Panel 前端数据同步
 * 
 * 功能：
 * - 自动检测网络状态
 * - 离线时使用 localStorage
 * - 在线时自动同步到云端
 * - 支持手动同步按钮
 */

// ============================================
// 配置
: 'https://pepper-sync-api.vercel.app/api',
// ============================================
const SYNC_CONFIG = {
  // 后端 API 地址
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://pepper-sync-ng9l864i8-hujerry618s-projects.vercel.app/api',
  
  // 自动同步间隔（毫秒）
  AUTO_SYNC_INTERVAL: 30000, // 30 秒
  
  // 本地存储键名
  STORAGE_KEYS: {
    TOKEN: 'panel_token',
    REFRESH_TOKEN: 'panel_refresh_token',
    USER_DATA: 'panel_user_data',
    LAST_SYNC: 'panel_last_sync',
    IS_LOGGED_IN: 'panel_is_logged_in'
  }
};

// ============================================
// 状态管理
// ============================================
const SyncState = {
  isOnline: navigator.onLine,
  isLoggedIn: false,
  isSyncing: false,
  lastSyncTime: null,
  token: null,
  refreshToken: null,
  localData: null,
  syncTimer: null
};

// ============================================
// 工具函数
// ============================================

/**
 * 安全地获取 localStorage 数据
 */
function getStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('读取 localStorage 失败:', e);
    return null;
  }
}

/**
 * 安全地设置 localStorage 数据
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('写入 localStorage 失败:', e);
    return false;
  }
}

/**
 * 移除 localStorage 数据
 */
function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('删除 localStorage 失败:', e);
  }
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'info') {
  // 如果页面有通知区域，显示通知
  const notificationArea = document.querySelector('.sync-notification');
  if (notificationArea) {
    notificationArea.textContent = message;
    notificationArea.className = `sync-notification ${type}`;
    notificationArea.style.display = 'block';
    
    setTimeout(() => {
      notificationArea.style.display = 'none';
    }, 3000);
  } else {
    // 否则使用 console
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * 更新 UI 状态
 */
function updateUIState() {
  // 更新同步按钮状态
  const syncBtn = document.querySelector('#sync-btn, .sync-button');
  if (syncBtn) {
    if (SyncState.isSyncing) {
      syncBtn.disabled = true;
      syncBtn.textContent = '同步中...';
    } else {
      syncBtn.disabled = false;
      syncBtn.textContent = SyncState.isLoggedIn ? '同步' : '登录同步';
    }
  }
  
  // 更新网络状态指示器
  const networkIndicator = document.querySelector('.network-status');
  if (networkIndicator) {
    networkIndicator.className = `network-status ${SyncState.isOnline ? 'online' : 'offline'}`;
    networkIndicator.title = SyncState.isOnline ? '在线' : '离线';
  }
  
  // 更新登录状态
  const loginIndicator = document.querySelector('.login-status');
  if (loginIndicator) {
    loginIndicator.className = `login-status ${SyncState.isLoggedIn ? 'logged-in' : 'logged-out'}`;
  }
}

// ============================================
// HTTP 请求封装
// ============================================

/**
 * 发送 HTTP 请求
 */
async function request(endpoint, options = {}) {
  const url = `${SYNC_CONFIG.API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // 添加认证 token
  if (SyncState.token) {
    defaultOptions.headers['Authorization'] = `Bearer ${SyncState.token}`;
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('请求错误:', error);
    throw error;
  }
}

// ============================================
// 认证相关
// ============================================

/**
 * 加载保存的认证信息
 */
function loadAuth() {
  SyncState.token = getStorage(SYNC_CONFIG.STORAGE_KEYS.TOKEN);
  SyncState.refreshToken = getStorage(SYNC_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  SyncState.isLoggedIn = getStorage(SYNC_CONFIG.STORAGE_KEYS.IS_LOGGED_IN) || false;
  
  return SyncState.isLoggedIn;
}

/**
 * 保存认证信息
 */
function saveAuth(token, refreshToken) {
  SyncState.token = token;
  SyncState.refreshToken = refreshToken;
  SyncState.isLoggedIn = true;
  
  setStorage(SYNC_CONFIG.STORAGE_KEYS.TOKEN, token);
  setStorage(SYNC_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  setStorage(SYNC_CONFIG.STORAGE_KEYS.IS_LOGGED_IN, true);
  
  updateUIState();
}

/**
 * 清除认证信息（登出）
 */
function clearAuth() {
  SyncState.token = null;
  SyncState.refreshToken = null;
  SyncState.isLoggedIn = false;
  
  removeStorage(SYNC_CONFIG.STORAGE_KEYS.TOKEN);
  removeStorage(SYNC_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  removeStorage(SYNC_CONFIG.STORAGE_KEYS.IS_LOGGED_IN);
  
  updateUIState();
}

/**
 * 刷新 token
 */
async function refreshAuthToken() {
  if (!SyncState.refreshToken) {
    return false;
  }
  
  try {
    const response = await request('/token/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: SyncState.refreshToken
      })
    });
    
    if (response.success) {
      saveAuth(response.data.token, response.data.refreshToken);
      return true;
    }
  } catch (error) {
    console.error('刷新 token 失败:', error);
    clearAuth();
  }
  
  return false;
}

/**
 * 用户注册
 */
async function register(email, password) {
  try {
    const response = await request('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      saveAuth(response.data.token, response.data.refreshToken);
      return response;
    }
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
}

/**
 * 用户登录
 */
async function login(email, password) {
  try {
    const response = await request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      saveAuth(response.data.token, response.data.refreshToken);
      return response;
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 用户登出
 */
function logout() {
  clearAuth();
  showNotification('已退出登录', 'info');
}

// ============================================
// 数据同步相关
// ============================================

/**
 * 加载本地数据
 */
function loadLocalData() {
  const data = getStorage(SYNC_CONFIG.STORAGE_KEYS.USER_DATA);
  SyncState.localData = data || {
    personalPanelData: {
      categories: [],
      websites: [],
      programs: [],
      directories: []
    },
    today_work_data: {
      tasks: [],
      reminders: []
    },
    settings: {
      theme: 'dark',
      color: 'blue',
      language: 'zh-CN',
      lockSettings: {}
    }
  };
  
  return SyncState.localData;
}

/**
 * 保存数据到本地
 */
function saveLocalData(data) {
  SyncState.localData = data;
  setStorage(SYNC_CONFIG.STORAGE_KEYS.USER_DATA, data);
  setStorage(SYNC_CONFIG.STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
}

/**
 * 获取云端数据
 */
async function fetchCloudData() {
  try {
    const response = await request('/data');
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.error('获取云端数据失败:', error);
    throw error;
  }
}

/**
 * 上传数据到云端
 */
async function uploadCloudData(data) {
  try {
    const response = await request('/data', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('上传数据失败:', error);
    throw error;
  }
}

/**
 * 增量同步
 */
async function incrementalSync(data, lastSyncTime) {
  try {
    const response = await request('/data/sync', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        lastSyncTime
      })
    });
    return response;
  } catch (error) {
    console.error('增量同步失败:', error);
    throw error;
  }
}

/**
 * 合并本地和云端数据
 * 策略：以后端数据为准
 */
function mergeData(localData, cloudData) {
  // 如果云端有数据，使用云端数据
  if (cloudData && cloudData.personalPanelData) {
    return cloudData;
  }
  // 否则使用本地数据
  return localData;
}

/**
 * 执行同步
 */
async function sync() {
  if (SyncState.isSyncing) {
    console.log('正在同步中，请稍候...');
    return false;
  }
  
  // 检查网络状态
  if (!SyncState.isOnline) {
    showNotification('网络不可用，使用本地数据', 'warning');
    return false;
  }
  
  // 检查登录状态
  if (!SyncState.isLoggedIn) {
    showNotification('请先登录', 'warning');
    return false;
  }
  
  SyncState.isSyncing = true;
  updateUIState();
  
  try {
    // 获取本地数据
    const localData = loadLocalData();
    const lastSyncTime = getStorage(SYNC_CONFIG.STORAGE_KEYS.LAST_SYNC);
    
    // 执行增量同步
    const result = await incrementalSync(localData, lastSyncTime);
    
    if (result.success) {
      // 合并数据（以后端为准）
      const mergedData = mergeData(localData, result.data);
      
      // 保存到本地
      saveLocalData(mergedData);
      
      // 更新最后同步时间
      SyncState.lastSyncTime = result.data.lastSyncTime;
      
      showNotification('同步成功', 'success');
      
      // 触发自定义事件，通知其他模块数据已更新
      window.dispatchEvent(new CustomEvent('data-synced', {
        detail: { data: mergedData }
      }));
      
      return true;
    }
  } catch (error) {
    console.error('同步失败:', error);
    
    // 如果是 token 过期，尝试刷新
    if (error.message?.includes('过期')) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        showNotification('Token 已刷新，请重新同步', 'info');
        return false; // 让用户手动重新同步
      }
    }
    
    showNotification('同步失败：' + error.message, 'error');
    return false;
  } finally {
    SyncState.isSyncing = false;
    updateUIState();
  }
}

/**
 * 自动同步
 */
async function autoSync() {
  if (SyncState.isOnline && SyncState.isLoggedIn && !SyncState.isSyncing) {
    await sync();
  }
}

// ============================================
// 网络状态监听
// ============================================

function setupNetworkListeners() {
  // 监听在线状态
  window.addEventListener('online', () => {
    SyncState.isOnline = true;
    showNotification('网络已连接', 'success');
    updateUIState();
    
    // 网络恢复时自动同步
    if (SyncState.isLoggedIn) {
      setTimeout(() => sync(), 1000);
    }
  });
  
  window.addEventListener('offline', () => {
    SyncState.isOnline = false;
    showNotification('网络已断开，使用本地数据', 'warning');
    updateUIState();
  });
}

// ============================================
// 初始化
// ============================================

/**
 * 初始化同步模块
 */
function initSync() {
  console.log('🔄 初始化数据同步模块...');
  
  // 加载认证信息
  loadAuth();
  
  // 加载本地数据
  loadLocalData();
  
  // 设置网络监听
  setupNetworkListeners();
  
  // 更新 UI
  updateUIState();
  
  // 启动自动同步（如果已登录）
  if (SyncState.isLoggedIn) {
    SyncState.syncTimer = setInterval(autoSync, SYNC_CONFIG.AUTO_SYNC_INTERVAL);
    console.log('✅ 自动同步已启动（间隔：' + SYNC_CONFIG.AUTO_SYNC_INTERVAL / 1000 + '秒）');
  }
  
  // 如果 token 存在但未登录，尝试验证
  if (SyncState.token && !SyncState.isLoggedIn) {
    // 可以在这里添加验证 token 的逻辑
    console.log('发现未完成的登录会话');
  }
  
  console.log('✅ 同步模块初始化完成');
  console.log('   网络状态:', SyncState.isOnline ? '在线' : '离线');
  console.log('   登录状态:', SyncState.isLoggedIn ? '已登录' : '未登录');
}

// ============================================
// 导出 API
// ============================================

window.PanelSync = {
  // 初始化
  init: initSync,
  
  // 认证
  register,
  login,
  logout,
  isLoggedIn: () => SyncState.isLoggedIn,
  
  // 数据操作
  getData: () => loadLocalData(),
  setData: (data) => {
    saveLocalData(data);
    // 如果在线且已登录，自动同步
    if (SyncState.isOnline && SyncState.isLoggedIn) {
      sync();
    }
  },
  
  // 同步
  sync,
  forceSync: sync, // 别名
  
  // 状态
  getStatus: () => ({
    isOnline: SyncState.isOnline,
    isLoggedIn: SyncState.isLoggedIn,
    isSyncing: SyncState.isSyncing,
    lastSyncTime: SyncState.lastSyncTime
  }),
  
  // 配置
  setApiUrl: (url) => {
    SYNC_CONFIG.API_URL = url;
  }
};

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSync);
} else {
  initSync();
}

// ============================================
// CSS 样式（可选，用于通知和状态指示器）
// ============================================
const syncStyles = `
  .sync-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    z-index: 9999;
    display: none;
    animation: slideIn 0.3s ease;
  }
  
  .sync-notification.success { background: #10b981; }
  .sync-notification.error { background: #ef4444; }
  .sync-notification.warning { background: #f59e0b; }
  .sync-notification.info { background: #3b82f6; }
  
  .network-status {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .network-status.online { background: #10b981; }
  .network-status.offline { background: #ef4444; }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// 添加样式到页面
if (!document.getElementById('sync-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'sync-styles';
  styleEl.textContent = syncStyles;
  document.head.appendChild(styleEl);
}
