/**
 * 认证路由
 * 处理用户注册、登录、token 刷新等操作
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { userOps, ensureDbInitialized } from '../database.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';

const router = express.Router();

// 确保数据库已初始化的中间件
router.use(async (req, res, next) => {
  await ensureDbInitialized();
  next();
});

/**
 * POST /api/register
 * 用户注册
 * 请求体：{ email, password }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }
    
    // 验证密码强度（至少 6 位）
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为 6 位'
      });
    }
    
    // 检查邮箱是否已存在
    const existingUser = userOps.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }
    
    // 加密密码
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // 创建用户
    const userId = userOps.create(email, passwordHash);
    
    // 生成 token
    const user = { id: userId, email };
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: userId,
          email
        },
        token,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * POST /api/login
 * 用户登录
 * 请求体：{ email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }
    
    // 查找用户
    const user = userOps.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 生成 token
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email
        },
        token,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * POST /api/token/refresh
 * 刷新 token
 * 请求体：{ refreshToken }
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: '请提供刷新 token'
      });
    }
    
    // 验证刷新 token
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_SECRET);
    
    // 检查是否为刷新 token
    if (decoded.type !== 'refresh') {
      return res.status(403).json({
        success: false,
        message: '无效的刷新 token'
      });
    }
    
    // 验证用户是否存在
    const user = userOps.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 生成新的 token 和刷新 token
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    res.json({
      success: true,
      message: 'Token 刷新成功',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
    
  } catch (error) {
    console.error('Token 刷新错误:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '刷新 token 已过期，请重新登录'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: '无效的刷新 token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * GET /api/auth/me
 * 获取当前用户信息
 */
router.get('/me', (req, res) => {
  // 这个路由需要 authenticateToken 中间件
  // 在 server.js 中会添加
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '未认证'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export default router;
