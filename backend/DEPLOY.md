# 部署指南

Advanced Personal Panel 后端服务支持多种云平台部署。

## 📋 部署前准备

### 1. 环境变量配置

生产环境必须配置以下环境变量：

```bash
# JWT 密钥（必须更改为强随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# JWT 过期时间
JWT_EXPIRES_IN=7d

# 允许的 CORS 源（你的 GitHub Pages 域名）
ALLOWED_ORIGINS=https://yourusername.github.io

# 数据库路径（可选，默认使用 data.db）
DATABASE_PATH=./data.db

# 速率限制配置
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. 生成安全的 JWT_SECRET

使用以下命令生成随机密钥：

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 或使用在线工具：https://generate-secret.vercel.app/64
```

---

## 🚀 部署到 Vercel

Vercel 是最简单的部署方式，支持 Serverless 函数。

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

### 步骤 3: 初始化项目

在项目根目录运行：

```bash
vercel
```

按提示操作：
- Set up and deploy? **Y**
- Which scope? **选择你的账户**
- Link to existing project? **N**
- Project name? **personal-panel-backend**
- Directory? **./backend** (如果在项目根目录运行)
- Override settings? **N**

### 步骤 4: 配置环境变量

在 Vercel 控制台设置环境变量：

1. 访问 https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：
   - `JWT_SECRET` (生产环境)
   - `ALLOWED_ORIGINS` (你的 GitHub Pages 域名)
   - `JWT_EXPIRES_IN` (可选，默认 7d)

### 步骤 5: 部署

```bash
# 开发环境部署（预览）
vercel

# 生产环境部署
vercel --prod
```

### 步骤 6: 获取部署 URL

部署完成后，Vercel 会提供类似以下的 URL：
```
https://personal-panel-backend.vercel.app
```

将此 URL 配置到前端的 `sync.js` 中：

```javascript
const SYNC_CONFIG = {
  API_URL: 'https://personal-panel-backend.vercel.app/api'
};
```

---

## 🚂 部署到 Railway

Railway 提供简单的 Node.js 部署和持久化存储。

### 步骤 1: 创建 Railway 项目

1. 访问 https://railway.app
2. 点击 **New Project**
3. 选择 **Deploy from GitHub repo**

### 步骤 2: 连接 GitHub 仓库

1. 授权 Railway 访问你的 GitHub
2. 选择包含后端代码的仓库
3. Railway 会自动检测 Node.js 项目

### 步骤 3: 配置环境变量

在 Railway 项目页面：
1. 进入 **Variables** 标签
2. 添加所有必需的环境变量（参考上文）

### 步骤 4: 配置持久化存储

Railway 的临时文件系统会在重启后清除数据，需要配置持久化卷：

1. 进入项目页面
2. 点击 **+ New** → **Volume**
3. 设置挂载点为 `/app/data`
4. 修改 `DATABASE_PATH` 环境变量为 `/app/data/data.db`

### 步骤 5: 部署

推送代码到 GitHub 后，Railway 会自动部署。

你也可以手动触发：

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署
railway up
```

### 步骤 6: 获取部署 URL

在 Railway 项目页面找到生成的 URL：
```
https://your-project.railway.app
```

---

## 🌿 部署到 Heroku

### 步骤 1: 安装 Heroku CLI

下载地址：https://devcenter.heroku.com/articles/heroku-cli

### 步骤 2: 登录 Heroku

```bash
heroku login
```

### 步骤 3: 创建应用

```bash
cd backend
heroku create personal-panel-backend
```

### 步骤 4: 配置环境变量

```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set ALLOWED_ORIGINS=https://yourusername.github.io
heroku config:set JWT_EXPIRES_IN=7d
```

### 步骤 5: 添加 SQLite 构建包

Heroku 默认使用临时文件系统，需要添加持久化存储：

```bash
# 添加 SQLite 构建包
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt

# 或者使用附加组件（推荐）
heroku addons:create heroku-postgresql:hobby-dev
```

**注意**: Heroku 的免费套餐已停止，建议使用 Vercel 或 Railway。

### 步骤 6: 部署

```bash
git push heroku main
```

### 步骤 7: 查看日志

```bash
heroku logs --tail
```

---

## 🔧 其他部署方式

### Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
docker build -t personal-panel-backend .
docker run -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e ALLOWED_ORIGINS=https://yourusername.github.io \
  personal-panel-backend
```

### 传统 VPS 部署

1. 安装 Node.js 18+
2. 克隆代码到服务器
3. 安装依赖：`npm install`
4. 配置环境变量
5. 使用 PM2 管理进程：

```bash
npm install -g pm2
pm2 start server.js --name personal-panel-backend
pm2 save
pm2 startup
```

---

## ✅ 部署验证

部署完成后，测试以下端点：

```bash
# 健康检查
curl https://your-deployment.vercel.app/health

# API 信息
curl https://your-deployment.vercel.app/api

# 注册测试
curl -X POST https://your-deployment.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 🔐 安全建议

### 生产环境必须配置

1. **强 JWT_SECRET**: 至少 32 位随机字符
2. **HTTPS**: 所有部署平台默认提供
3. **CORS 限制**: 只允许你的前端域名
4. **速率限制**: 防止 API 滥用

### 数据库备份

定期备份 SQLite 数据库文件：

```bash
# Vercel 不适用（无持久化存储）
# Railway: 使用 Volume 快照
# Heroku: 使用 pg:backups（如果使用 PostgreSQL）

# VPS: 定期复制 data.db 文件
cp data.db data.db.backup.$(date +%Y%m%d)
```

### 监控和日志

- **Vercel**: 控制台查看函数日志
- **Railway**: 实时日志流
- **Heroku**: `heroku logs --tail`

---

## 🆘 故障排查

### 问题：CORS 错误

**解决**: 检查 `ALLOWED_ORIGINS` 是否包含你的前端域名（不含末尾斜杠）

### 问题：数据库文件不存在

**解决**: 确保有写权限，或配置正确的 `DATABASE_PATH`

### 问题：Token 验证失败

**解决**: 检查 `JWT_SECRET` 是否一致，确保没有空格

### 问题：部署后 500 错误

**解决**: 查看平台日志，通常是环境变量缺失或配置错误

---

## 📞 支持

如有问题，请查看：
- [README.md](./README.md) - API 文档
- GitHub Issues - 提交问题
