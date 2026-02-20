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

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  try {
    // Load existing users
    let users = [];
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf-8');
      users = JSON.parse(data);
    }

    // Check if admin already exists
    const existingAdmin = users.find(user => user.email === adminEmail);
    if (existingAdmin) {
      console.log(`\n⚠️  Admin user with email ${adminEmail} already exists.`);
      console.log(`   If you want to reset the password, delete the user from ${usersFile} and run this script again.\n`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    users.push(admin);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

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
