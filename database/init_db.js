const fs = require('fs');
const path = require('path');

let mysql;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  try {
    mysql = require('../user-product-service/node_modules/mysql2/promise');
  } catch (e2) {
    console.error('❌ Could not locate mysql2. Please ensure dependencies are installed via npm install.');
    process.exit(1);
  }
}

// Function to read .env file directly
function getEnvConfig() {
  const envPath = path.join(__dirname, '../user-product-service/.env');
  const config = {
    DB_HOST: 'localhost',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: '',
  };

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0) {
          config[key.trim()] = vals.join('=').trim();
        }
      }
    });
  }

  return {
    host: config.DB_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(config.DB_PORT || process.env.DB_PORT || '3306', 10),
    user: config.DB_USER || process.env.DB_USER || 'root',
    password: config.DB_PASSWORD || process.env.DB_PASSWORD || '',
    multipleStatements: true,
  };
}

async function initDatabases() {
  const DB_CONFIG = getEnvConfig();
  console.log(`🔄 Connecting to MySQL server at ${DB_CONFIG.host}:${DB_CONFIG.port} with user "${DB_CONFIG.user}"...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      multipleStatements: true,
    });
    console.log('✅ Connected to MySQL server successfully.');

    // 1. Create User & Product schema
    console.log('📦 Setting up `ecommerce_users_products` database...');
    const userProductSql = fs.readFileSync(path.join(__dirname, 'user_product_schema.sql'), 'utf-8');
    await connection.query(userProductSql);
    console.log('✅ User & Product schema applied.');

    // 2. Create Order & Cart schema
    console.log('📦 Setting up `ecommerce_orders` database...');
    const orderCartSql = fs.readFileSync(path.join(__dirname, 'order_cart_schema.sql'), 'utf-8');
    await connection.query(orderCartSql);
    console.log('✅ Order & Cart schema applied.');

    // 3. Seed data
    console.log('🌱 Seeding sample categories, products, demo accounts, and orders into MySQL Workbench...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await connection.query(seedSql);
    console.log('✅ Database seeded successfully!');

    console.log('\n🎉 All databases and sample records initialized successfully in MySQL Server!');
    console.log('----------------------------------------------------');
    console.log('Open MySQL Workbench, click Refresh on Schemas:');
    console.log('  - Schema: ecommerce_users_products');
    console.log('  - Schema: ecommerce_orders');
    console.log('----------------------------------------------------\n');
  } catch (error) {
    console.error('❌ Error during database initialization:', error.message);
    console.log('\nTip: Make sure MySQL is running and password matches in your .env or DB_PASSWORD config.');
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  initDatabases();
}

module.exports = initDatabases;
