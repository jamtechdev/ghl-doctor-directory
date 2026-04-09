/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.join(process.cwd(), '.env') });

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function safeIdentifier(name, fallback) {
  const finalName = name || fallback;
  if (!/^[a-zA-Z0-9_]+$/.test(finalName)) {
    throw new Error(`Invalid database name: "${finalName}"`);
  }
  return finalName;
}

function formatError(error) {
  if (error instanceof Error) {
    const details = {
      name: error.name,
      message: error.message || '(empty message)',
      code: error.code || undefined,
      errno: error.errno || undefined,
      sqlState: error.sqlState || undefined,
      sqlMessage: error.sqlMessage || undefined,
      stack: error.stack || undefined,
    };
    return JSON.stringify(details, null, 2);
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

const DEFAULT_DIRECTORY_SEO = {
  title: 'Doctor Directory - Find the Right Doctor for Your Needs',
  description: 'Search and filter through our comprehensive directory of qualified doctors. Find specialists by name, specialty, condition, or location.',
  keywords: [
    'doctor directory',
    'find doctor',
    'medical professionals',
    'specialists',
    'healthcare',
    'physician search',
  ],
  organization: {
    name: 'Doctor Directory',
    description: 'Find qualified doctors and specialists by specialty, location, and condition.',
    url: 'https://example.com',
    logo: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
  },
  openGraph: {
    enabled: true,
    title: 'Doctor Directory - Find the Right Doctor',
    description: 'Search and filter through our comprehensive directory of qualified doctors.',
    type: 'website',
    image: '',
    siteName: 'Doctor Directory',
  },
  twitter: {
    enabled: false,
    card: 'summary_large_image',
    title: 'Doctor Directory',
    description: 'Find the right doctor for your needs.',
    image: '',
    site: '',
    creator: '',
  },
  robots: {
    index: false,
    follow: false,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
  },
  canonicalUrl: '',
  alternateLanguages: [],
  analytics: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    microsoftClarityId: '',
  },
  socialMedia: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  },
  structuredData: {
    enabled: true,
    organizationSchema: true,
    breadcrumbSchema: true,
    websiteSchema: true,
  },
  sitemap: {
    enabled: false,
    changefreq: 'yearly',
    priority: 0,
  },
};

async function createTables(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(191) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role ENUM('admin', 'doctor') NOT NULL,
      slug VARCHAR(191) NULL UNIQUE,
      specialty VARCHAR(255) NULL,
      specialties JSON NULL,
      location JSON NULL,
      conditions JSON NULL,
      bio TEXT NULL,
      image VARCHAR(500) NULL,
      contact JSON NULL,
      education JSON NULL,
      certifications JSON NULL,
      brandColor VARCHAR(32) NULL,
      createdAt DATETIME(3) NOT NULL,
      updatedAt DATETIME(3) NULL,
      INDEX idx_users_role (role),
      INDEX idx_users_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS seo_settings (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      settings_key VARCHAR(100) NOT NULL UNIQUE,
      settings_value JSON NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id VARCHAR(191) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(50) NULL,
      dateOfBirth DATE NULL,
      gender ENUM('male', 'female', 'other') NULL,
      address TEXT NULL,
      city VARCHAR(100) NULL,
      state VARCHAR(100) NULL,
      zipCode VARCHAR(20) NULL,
      medicalHistory TEXT NULL,
      allergies JSON NULL,
      medications JSON NULL,
      emergencyContact JSON NULL,
      doctorId VARCHAR(191) NULL,
      userId VARCHAR(191) NOT NULL,
      createdAt DATETIME(3) NOT NULL,
      updatedAt DATETIME(3) NOT NULL,
      INDEX idx_patients_userId (userId),
      INDEX idx_patients_doctorId (doctorId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function seedSEOSettings(connection) {
  await connection.query(
    `
      INSERT INTO seo_settings (settings_key, settings_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        settings_value = VALUES(settings_value),
        updatedAt = CURRENT_TIMESTAMP(3)
    `,
    ['directory', JSON.stringify(DEFAULT_DIRECTORY_SEO)]
  );
}

async function initMySQLTables() {
  const host = process.env.DB_HOST || 'localhost';
  const port = toInt(process.env.DB_PORT, 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = safeIdentifier(process.env.DB_NAME, 'doctor_directory_mysql');

  let rootConnection;
  let dbConnection;

  try {
    console.log(`Connecting to MySQL: ${user}@${host}:${port}`);
    rootConnection = await mysql.createConnection({ host, port, user, password });
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`Database ready: ${database}`);

    dbConnection = await mysql.createConnection({ host, port, user, password, database });
    await createTables(dbConnection);
    await seedSEOSettings(dbConnection);
    console.log('Tables ready: users, seo_settings, patients');
    console.log('Seed ready: seo_settings.directory');
    console.log('Done: JSON functionality removed. App uses MySQL only.');
  } catch (error) {
    console.error('Failed to initialize MySQL tables:');
    console.error(formatError(error));
    process.exitCode = 1;
  } finally {
    if (dbConnection) {
      await dbConnection.end();
    }
    if (rootConnection) {
      await rootConnection.end();
    }
  }
}

initMySQLTables();
