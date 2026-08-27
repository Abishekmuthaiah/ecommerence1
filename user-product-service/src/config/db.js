const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'ecommerce_users_products';

let sequelize;

// Try initializing MySQL or fallback to SQLite
function createSequelizeInstance() {
  const dbDir = path.join(__dirname, '../../database');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  // Default to MySQL if credentials set, else SQLite fallback for zero-config
  if (process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== '') {
    return new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' },
    });
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: path.join(dbDir, 'ecommerce_users_products.sqlite'),
    logging: false,
    define: { underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' },
  });
}

sequelize = createSequelizeInstance();

async function connectDB() {
  try {
    if (sequelize.getDialect() === 'mysql') {
      const conn = await mysql.createConnection({ host: dbHost, port: dbPort, user: dbUser, password: dbPassword });
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await conn.end();
      await sequelize.authenticate();
      console.log(`✅ [User-Product Service] MySQL Connected: Database "${dbName}"`);
    } else {
      await sequelize.authenticate();
      console.log('✅ [User-Product Service] Storage Connected (Tip: To connect to MySQL server, set DB_PASSWORD in .env).');
    }
  } catch (error) {
    console.error('❌ [User-Product Service] DB Connection error:', error.message);
    throw error;
  }
}

module.exports = { sequelize, connectDB };
