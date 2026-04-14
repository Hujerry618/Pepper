# 🚀 Vercel 一键部署指南

## 方式一：通过 Vercel 网站部署（推荐 - 最简单）

### 步骤 1：访问 Vercel
打开 https://vercel.com/new

### 步骤 2：登录 GitHub
- 点击 **Continue with GitHub**
- 授权 Vercel 访问 GitHub

### 步骤 3：导入项目
- 点击 **Import Git Repository**
- 选择你的仓库：`Hujerry618/Pepper`
- 点击 **Import**

### 步骤 4：配置项目
- **Framework Preset**: 选择 `Other`
- **Root Directory**: 点击 **Edit**，输入 `backend`
- **Build Command**: 留空（无需构建）
- **Output Directory**: 留空

### 步骤 5：添加环境变量
点击 **Add** 添加以下环境变量：

| Name | Value |
|------|-------|
| `JWT_SECRET` | 随机字符串（如 `my-super-secret-jwt-key-2026`） |
| `ALLOWED_ORIGINS` | `https://hujerry618.github.io,https://pepper.hujerry618.github.io` |

### 步骤 6：部署
- 点击 **Deploy**
- 等待部署完成（约 1-2 分钟）

### 步骤 7：获取 API 地址
- 部署完成后，点击 **Continue to Dashboard**
- 复制域名（如 `https://pepper-backend.vercel.app`）
- 这就是你的后端 API 地址！

---

## 方式二：通过 Vercel CLI 部署

### 步骤 1：安装 Vercel CLI
```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel
```bash
cd backend
vercel login
```

### 步骤 3：部署
```bash
vercel --prod
```

### 步骤 4：设置环境变量
访问 Vercel Dashboard：
1. https://vercel.com/dashboard
2. 选择你的项目
3. Settings → Environment Variables
4. 添加环境变量（同上）

### 步骤 5：重新部署
```bash
vercel --prod
```

---

## 📝 部署后配置

### 1. 更新前端 API 地址

编辑 `sync.js`，找到：
```javascript
const API_URL = 'http://localhost:3000'; // 改为你的 Vercel 地址
```

改为：
```javascript
const API_URL = 'https://pepper-backend.vercel.app'; // 你的 Vercel 域名
```

### 2. 更新 CORS 配置

在 Vercel Dashboard：
1. Settings → Environment Variables
2. 编辑 `ALLOWED_ORIGINS`
3. 添加你的 GitHub Pages 域名：
   ```
   https://hujerry618.github.io,https://pepper.hujerry618.github.io
   ```

### 3. 测试 API

访问健康检查端点：
```
https://pepper-backend.vercel.app/health
```

应该返回：
```json
{"status":"ok","timestamp":"2026-04-14T..."}
```

---

## 🔧 常见问题

### Q1: 部署失败
**解决**: 检查 `backend/vercel.json` 配置是否正确

### Q2: CORS 错误
**解决**: 确保 `ALLOWED_ORIGINS` 包含你的前端域名

### Q3: 数据库不持久
**解决**: Vercel Serverless 函数是无状态的，考虑使用：
- **Vercel KV** (Redis) - 推荐
- **Vercel Postgres** - 完整数据库
- **外部数据库** (MongoDB Atlas, Railway)

### Q4: 登录失败
**解决**: 检查 `JWT_SECRET` 环境变量是否设置

---

## 📊 Vercel 免费额度

| 资源 | 额度 |
|------|------|
| 带宽 | 100 GB/月 |
| Serverless 执行 | 100 GB-小时/月 |
| 部署数量 | 无限 |
| 自定义域名 | 无限 |

对于个人导航面板，免费额度完全够用！

---

## 🎯 下一步

1. ✅ 完成 Vercel 部署
2. ✅ 获取 API 地址
3. ✅ 更新 `sync.js` 中的 `API_URL`
4. ✅ 推送到 GitHub Pages
5. ✅ 测试登录和同步功能

---

## 📞 支持

遇到问题？
- Vercel 文档：https://vercel.com/docs
- 项目 Issues：https://github.com/Hujerry618/Pepper/issues

---

🌶️ **过程省略，只看结果！**
