/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Admin User Creation Script (JavaScript version)
 * 
 * Run with: node scripts/create-admin.js
 * 
 * This script creates an admin user in the database.
 * Default credentials:
 * - Email: admin@example.com
 * - Password: admin123
 * 
 * You can override these with environment variables:
 * ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword node scripts/create-admin.js
 */

const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'doctor_directory_mysql',
    });

    // Check if admin already exists
    const [existingRows] = await connection.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [adminEmail]
    );
    const existingAdmin = Array.isArray(existingRows) && existingRows.length > 0;
    if (existingAdmin) {
      console.log(`\n⚠️  Admin user with email ${adminEmail} already exists.`);
      console.log('   If you want to reset password, update this user in MySQL and run again.\n');
      await connection.end();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminId = Date.now().toString() + Math.random().toString(36).slice(2, 11);
    const now = new Date();
    await connection.query(
      `INSERT INTO users (id, email, password, name, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'admin', ?, ?)`,
      [adminId, adminEmail, hashedPassword, adminName, now, now]
    );
    await connection.end();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', adminEmail);
    console.log('🔑 Password: ', adminPassword);
    console.log('👤 Name:     ', adminName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Please change the password after first login!\n');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin();
