# Advanced Personal Panel 后端服务

个人导航面板的数据同步后端服务，支持用户认证、数据存储和云端同步。

## 🚀 功能特性

- **用户认证**: 注册、登录、JWT Token 管理
- **数据同步**: 全量更新、增量同步、冲突处理
- **数据安全**: bcrypt 密码加密、CORS 限制、速率限制
- **轻量部署**: SQLite 数据库，支持 Vercel/Railway/Heroku

## 📋 API 文档

### 基础信息

- **Base URL**: `http://localhost:3000/api` (开发环境)
- **认证方式**: Bearer Token (JWT)
- **请求格式**: JSON
- **响应格式**: JSON

### 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

错误响应：

```json
{
  "success": false,
  "message": "错误描述"
}
```

---

## 🔐 认证接口

### 1. 用户注册

**POST** `/api/register`

注册新用户账户。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**状态码**:
- `201`: 注册成功
- `400`: 输入验证失败
- `409`: 邮箱已被注册

---

### 2. 用户登录

**POST** `/api/login`

用户登录获取访问令牌。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**状态码**:
- `200`: 登录成功
- `400`: 输入验证失败
- `401`: 邮箱或密码错误

---

### 3. 刷新 Token

**POST** `/api/token/refresh`

使用刷新令牌获取新的访问令牌。

**请求体**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**:
```json
{
  "success": true,
  "message": "Token 刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**状态码**:
- `200`: 刷新成功
- `400`: 未提供刷新令牌
- `401`: 刷新令牌过期
- `403`: 无效的刷新令牌

---

### 4. 获取当前用户信息

**GET** `/api/auth/me`

获取当前登录用户的信息。

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
}
```

---

## 📊 数据同步接口

### 5. 获取所有数据

**GET** `/api/data`

获取用户的所有数据（个人面板数据、工作任务、设置等）。

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "personalPanelData": {
      "categories": [...],
      "websites": [...],
      "programs": [...],
      "directories": [...]
    },
    "today_work_data": {
      "tasks": [...],
      "reminders": [...]
    },
    "settings": {
      "theme": "dark",
      "color": "blue",
      "language": "zh-CN",
      "lockSettings": {}
    },
    "lastSyncTime": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 6. 全量更新数据

**PUT** `/api/data`

全量更新用户的所有数据。

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "personalPanelData": { ... },
  "today_work_data": { ... },
  "settings": { ... }
}
```

**响应**:
```json
{
  "success": true,
  "message": "数据更新成功",
  "data": {
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 7. 增量同步

**POST** `/api/data/sync`

增量同步数据，支持冲突处理。

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "lastSyncTime": "2024-01-15T10:00:00.000Z",
  "personalPanelData": { ... },
  "today_work_data": { ... },
  "settings": { ... }
}
```

**响应**:
```json
{
  "success": true,
  "message": "同步成功",
  "data": {
    "personalPanelData": { ... },
    "today_work_data": { ... },
    "settings": { ... },
    "lastSyncTime": "2024-01-15T10:30:00.000Z",
    "conflict": false
  },
  "changesCount": 3
}
```

**冲突处理策略**: 以后端数据为准

---

### 8. 获取特定类型数据

**GET** `/api/data/:dataType`

获取指定类型的数据。

**参数**:
- `dataType`: `personalPanelData` | `today_work_data` | `settings`

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 9. 更新特定类型数据

**PUT** `/api/data/:dataType`

更新指定类型的数据。

**参数**:
- `dataType`: `personalPanelData` | `today_work_data` | `settings`

**请求头**:
```
Authorization: Bearer <token>
```

**请求体**: 对应类型的数据对象

**响应**:
```json
{
  "success": true,
  "message": "数据更新成功",
  "data": {
    "dataType": "settings",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🔒 安全说明

### Token 使用

1. **访问令牌 (Token)**: 有效期 7 天，用于 API 请求认证
2. **刷新令牌 (Refresh Token)**: 有效期 30 天，用于刷新访问令牌

### 认证流程

```javascript
// 1. 登录获取 token
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token, refreshToken } = response.data;

// 2. 使用 token 访问受保护的 API
const data = await fetch('/api/data', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 3. Token 过期时使用 refreshToken 刷新
if (response.expired) {
  const newToken = await fetch('/api/token/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
}
```

### 速率限制

- **普通接口**: 100 请求/15 分钟
- **认证接口**: 10 请求/15 分钟（防止暴力破解）

---

## 🛠️ 本地开发

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

### 测试 API

```bash
# 健康检查
curl http://localhost:3000/health

# API 信息
curl http://localhost:3000/api
```

---

## 📦 部署

详见 [DEPLOY.md](./DEPLOY.md)

---

## 📝 数据结构

### personalPanelData

```json
{
  "categories": [
    { "id": 1, "name": "办公", "position": 1 }
  ],
  "websites": [
    { "id": 1, "name": "GitHub", "url": "https://github.com", "categoryId": 1 }
  ],
  "programs": [
    { "id": 1, "name": "VS Code", "path": "C:\\Program Files\\..." }
  ],
  "directories": [
    { "id": 1, "name": "工作文档", "path": "D:\\Documents\\Work" }
  ]
}
```

### today_work_data

```json
{
  "tasks": [
    { "id": 1, "title": "完成任务", "completed": false, "dueDate": "2024-01-15" }
  ],
  "reminders": [
    { "id": 1, "title": "会议提醒", "time": "2024-01-15T14:00:00" }
  ]
}
```

### settings

```json
{
  "theme": "dark",
  "color": "blue",
  "language": "zh-CN",
  "lockSettings": {
    "enabled": false,
    "password": "hashed_password"
  }
}
```

---

## 📄 许可证

MIT License
