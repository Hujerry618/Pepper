/**
 * 数据同步路由
 * 处理用户数据的获取、更新、同步等操作
 */

import express from 'express';
import { dataOps, syncLogOps, ensureDbInitialized } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 确保数据库已初始化的中间件
router.use(async (req, res, next) => {
  await ensureDbInitialized();
  next();
});

/**
 * GET /api/data
 * 获取用户所有数据
 * 需要认证
 */
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取用户所有数据
    const allData = dataOps.getAllByUserId(userId);
    
    // 整理数据结构
    const result = {
      personalPanelData: null,
      today_work_data: null,
      settings: null,
      lastSyncTime: syncLogOps.getLastSyncTime(userId)
    };
    
    // 填充数据
    allData.forEach(item => {
      result[item.data_type] = item.data_json;
    });
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('获取数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * PUT /api/data
 * 全量更新用户数据
 * 请求体：{ personalPanelData, today_work_data, settings }
 * 需要认证
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newData = req.body;
    
    // 验证数据
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({
        success: false,
        message: '无效的数据格式'
      });
    }
    
    // 全量更新数据
    dataOps.updateAll(userId, newData);
    
    // 记录同步日志
    const dataTypes = Object.keys(newData);
    syncLogOps.log(userId, 'full_update', dataTypes.length);
    
    res.json({
      success: true,
      message: '数据更新成功',
      data: {
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('更新数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * POST /api/data/sync
 * 增量同步
 * 请求体：{ personalPanelData?, today_work_data?, settings?, lastSyncTime? }
 * 需要认证
 */
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { lastSyncTime, ...data } = req.body;
    
    // 获取云端数据
    const cloudData = dataOps.getAllByUserId(userId);
    const cloudDataMap = {};
    cloudData.forEach(item => {
      cloudDataMap[item.data_type] = {
        data: item.data_json,
        version: item.version,
        updatedAt: item.updated_at
      };
    });
    
    // 冲突处理策略：以后端数据为准
    // 如果客户端提供了数据，则更新；否则返回云端数据
    const changesCount = Object.keys(data).length;
    
    if (changesCount > 0) {
      // 有数据需要更新
      Object.keys(data).forEach(type => {
        if (data[type] !== undefined) {
          dataOps.save(userId, type, data[type]);
        }
      });
      
      // 记录同步日志
      syncLogOps.log(userId, 'incremental_sync', changesCount);
    }
    
    // 返回合并后的数据
    const updatedCloudData = dataOps.getAllByUserId(userId);
    const result = {
      personalPanelData: null,
      today_work_data: null,
      settings: null,
      lastSyncTime: new Date().toISOString(),
      conflict: false // 如果发生冲突，可以设置为 true 并提示用户
    };
    
    updatedCloudData.forEach(item => {
      result[item.data_type] = item.data_json;
    });
    
    res.json({
      success: true,
      message: changesCount > 0 ? '同步成功' : '数据已是最新',
      data: result,
      changesCount
    });
    
  } catch (error) {
    console.error('同步数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * GET /api/data/:dataType
 * 获取特定类型的数据
 * 需要认证
 */
router.get('/:dataType', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { dataType } = req.params;
    
    // 验证数据类型
    const validTypes = ['personalPanelData', 'today_work_data', 'settings'];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: '无效的数据类型'
      });
    }
    
    // 获取数据
    const dataItem = dataOps.getByType(userId, dataType);
    
    if (!dataItem) {
      return res.json({
        success: true,
        data: null,
        message: '数据不存在'
      });
    }
    
    res.json({
      success: true,
      data: dataItem.data_json
    });
    
  } catch (error) {
    console.error('获取数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * PUT /api/data/:dataType
 * 更新特定类型的数据
 * 需要认证
 */
router.put('/:dataType', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dataType } = req.params;
    const newData = req.body;
    
    // 验证数据类型
    const validTypes = ['personalPanelData', 'today_work_data', 'settings'];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: '无效的数据类型'
      });
    }
    
    // 更新数据
    dataOps.save(userId, dataType, newData);
    
    // 记录同步日志
    syncLogOps.log(userId, 'partial_update', 1);
    
    res.json({
      success: true,
      message: '数据更新成功',
      data: {
        dataType,
        updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('更新数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

export default router;
