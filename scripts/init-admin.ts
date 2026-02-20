/**
 * Admin User Initialization Script
 * 
 * Run this script to create an admin user:
 * npx ts-node scripts/init-admin.ts
 * 
 * Or use Node.js directly:
 * node -r ts-node/register scripts/init-admin.ts
 */

import { hashPassword } from '../lib/auth';
import { getUserByEmail, createUser } from '../lib/db';

async function initAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  try {
    // Check if admin already exists
    const existingAdmin = getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user
    const admin = createUser({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
initAdmin();
