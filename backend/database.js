/**
 * 数据库连接模块
 * 使用 sql.js (WebAssembly SQLite) - 无需编译，跨平台兼容
 */

import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 数据库路径（支持 Vercel 临时文件系统）
const dbPath = process.env.DATABASE_PATH || join(__dirname, 'data.db');

// 数据库实例
let db = null;
let SQL = null;

/**
 * 数据库初始化标志
 */
let dbInitialized = false;

/**
 * 初始化数据库
 * 创建必要的表结构
 */
export async function initDatabase() {
  if (dbInitialized) {
    return db;
  }
  try {
    // 初始化 sql.js
    SQL = await initSqlJs();
    
    // 检查数据库文件是否存在
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ 数据库加载成功');
    } else {
      db = new SQL.Database();
      console.log('✅ 创建新数据库');
    }
    
    // 创建表结构
    createTables();
    
    console.log('✅ 数据库初始化完成');
    dbInitialized = true;
    return db;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

/**
 * 确保数据库已初始化（用于路由中间件）
 */
export async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
  }
  return db;
}

/**
 * 创建数据库表
 */
function createTables() {
  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 创建用户数据表
  db.run(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      data_type TEXT NOT NULL,
      data_json TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, data_type)
    )
  `);
  
  // 创建同步记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sync_type TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      changes_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // 创建索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_user_data_type ON user_data(data_type)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sync_log_user_id ON sync_log(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sync_log_timestamp ON sync_log(timestamp)`);
  
  // 保存数据库
  saveDatabase();
}

/**
 * 保存数据库到文件
 */
export function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    } catch (error) {
      console.error('保存数据库失败:', error);
    }
  }
}

/**
 * 获取数据库实例
 */
export function getDatabase() {
  return db;
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    console.log('数据库连接已关闭');
  }
}

/**
 * 辅助函数：执行查询并返回单行
 */
function getOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  
  stmt.free();
  return null;
}

/**
 * 辅助函数：执行查询并返回所有行
 */
function getAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  
  stmt.free();
  return results;
}

/**
 * 辅助函数：执行写操作
 */
function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  
  // 获取最后插入的 ID
  const result = getOne('SELECT last_insert_rowid() as lastId');
  return { lastInsertRowid: result?.lastId };
}

/**
 * 用户相关操作
 */
export const userOps = {
  /**
   * 创建新用户
   */
  create(email, passwordHash) {
    const result = run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );
    return result.lastInsertRowid;
  },
  
  /**
   * 根据邮箱查找用户
   */
  findByEmail(email) {
    return getOne('SELECT * FROM users WHERE email = ?', [email]);
  },
  
  /**
   * 根据 ID 查找用户
   */
  findById(id) {
    return getOne('SELECT id, email, created_at, updated_at FROM users WHERE id = ?', [id]);
  }
};

/**
 * 用户数据相关操作
 */
export const dataOps = {
  /**
   * 获取用户所有数据
   */
  getAllByUserId(userId) {
    const rows = getAll('SELECT * FROM user_data WHERE user_id = ?', [userId]);
    
    // 解析 JSON 数据
    return rows.map(row => ({
      ...row,
      data_json: JSON.parse(row.DATA_JSON || row.data_json)
    }));
  },
  
  /**
   * 获取特定类型的数据
   */
  getByType(userId, dataType) {
    const row = getOne(
      'SELECT * FROM user_data WHERE user_id = ? AND data_type = ?',
      [userId, dataType]
    );
    
    if (row) {
      return {
        ...row,
        data_json: JSON.parse(row.DATA_JSON || row.data_json)
      };
    }
    return null;
  },
  
  /**
   * 保存或更新数据
   */
  save(userId, dataType, data) {
    const existing = this.getByType(userId, dataType);
    
    if (existing) {
      // 更新现有数据
      run(
        `UPDATE user_data 
         SET data_json = ?, version = version + 1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND data_type = ?`,
        [JSON.stringify(data), userId, dataType]
      );
      return existing.ID || existing.id;
    } else {
      // 插入新数据
      const result = run(
        'INSERT INTO user_data (user_id, data_type, data_json) VALUES (?, ?, ?)',
        [userId, dataType, JSON.stringify(data)]
      );
      return result.lastInsertRowid;
    }
  },
  
  /**
   * 全量更新用户数据
   */
  updateAll(userId, allData) {
    const dataTypes = ['personalPanelData', 'today_work_data', 'settings'];
    
    dataTypes.forEach(type => {
      if (allData[type] !== undefined) {
        this.save(userId, type, allData[type]);
      }
    });
  }
};

/**
 * 同步日志操作
 */
export const syncLogOps = {
  /**
   * 记录同步操作
   */
  log(userId, syncType, changesCount = 0) {
    const result = run(
      'INSERT INTO sync_log (user_id, sync_type, changes_count) VALUES (?, ?, ?)',
      [userId, syncType, changesCount]
    );
    return result;
  },
  
  /**
   * 获取用户最后同步时间
   */
  getLastSyncTime(userId) {
    const result = getOne(
      'SELECT MAX(timestamp) as last_sync FROM sync_log WHERE user_id = ?',
      [userId]
    );
    return result?.LAST_SYNC || result?.last_sync || null;
  }
};
