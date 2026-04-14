/**
 * JWT 认证中间件
 * 验证请求中的 token 是否有效
 */

import jwt from 'jsonwebtoken';
import { userOps } from '../database.js';

/**
 * 验证 JWT token
 * 将验证后的用户信息附加到 req.user
 */
export function authenticateToken(req, res, next) {
  // 从 Authorization header 获取 token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供认证 token'
    });
  }
  
  // 验证 token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // token 过期
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token 已过期',
          expired: true
        });
      }
      
      // 其他错误
      return res.status(403).json({
        success: false,
        message: '无效的 token'
      });
    }
    
    // 从数据库获取用户信息
    const user = userOps.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 附加用户信息到请求对象
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    
    next();
  });
}

/**
 * 可选认证中间件
 * 如果提供了 token 则验证，否则继续（用于支持匿名访问）
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        const user = userOps.findById(decoded.userId);
        if (user) {
          req.user = {
            id: decoded.userId,
            email: decoded.email
          };
        }
      }
      next();
    });
  } else {
    next();
  }
}

/**
 * 生成 JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

/**
 * 生成刷新 token（使用不同的过期时间）
 */
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: 'refresh'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d' // 刷新 token 有效期 30 天
    }
  );
}
