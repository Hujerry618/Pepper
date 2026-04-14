/**
 * Advanced Personal Panel 后端服务
 * 主服务器入口文件
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import { authenticateToken } from './middleware/auth.js';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 初始化数据库（异步）
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// ============================================
// 中间件配置
// ============================================

// CORS 配置 - 只允许 GitHub Pages 域名
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback) {
    // 允许没有 origin 的请求（如 Postman、curl）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 请求体
app.use(express.json({ limit: '10mb' }));

// 解析 URL 编码请求体
app.use(express.urlencoded({ extended: true }));

// 速率限制 - 防止滥用
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 默认 15 分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 默认 100 请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后重试'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 对认证相关路由应用更严格的速率限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 10, // 10 次请求（防止暴力破解）
  message: {
    success: false,
    message: '尝试次数过多，请稍后再试'
  }
});

// 应用速率限制
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// ============================================
// 请求日志中间件
// ============================================
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ============================================
// 路由配置
// ============================================

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API 根路径
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Advanced Personal Panel API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/register',
        login: 'POST /api/login',
        refresh: 'POST /api/token/refresh',
        me: 'GET /api/auth/me'
      },
      data: {
        getAll: 'GET /api/data',
        updateAll: 'PUT /api/data',
        sync: 'POST /api/data/sync',
        getByType: 'GET /api/data/:type',
        updateByType: 'PUT /api/data/:type'
      }
    }
  });
});

// 认证路由
app.use('/api/auth', authRoutes);

// 兼容旧版本路由（直接使用 /api/register 等）
app.post('/api/register', (req, res, next) => {
  req.url = '/register';
  authRoutes(req, res, next);
});

app.post('/api/login', (req, res, next) => {
  req.url = '/login';
  authRoutes(req, res, next);
});

app.post('/api/token/refresh', (req, res, next) => {
  req.url = '/refresh';
  authRoutes(req, res, next);
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// 数据路由
app.use('/api/data', dataRoutes);

// ============================================
// 错误处理
// ============================================

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  
  // CORS 错误
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: '跨域请求被拒绝'
    });
  }
  
  // JSON 解析错误
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: '无效的 JSON 格式'
    });
  }
  
  // 默认错误
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? '服务器错误' 
      : err.message
  });
});

// ============================================
// 启动服务器
// ============================================

const PORT = process.env.PORT || 3000;

// Vercel 导出（Serverless 函数）
export default app;

// 本地开发时直接启动服务器
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  // 异步启动
  (async () => {
    await ensureDbInitialized();
    
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║   Advanced Personal Panel Backend Server     ║
╠═══════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}              ║
║  📍 http://localhost:${PORT}                    ║
║  🔗 http://localhost:${PORT}/api                ║
║  💚 Health: http://localhost:${PORT}/health     ║
╚═══════════════════════════════════════════════╝
      `);
    });
  })();
}
