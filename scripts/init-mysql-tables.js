/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const dataDir = path.join(process.cwd(), 'data');
const usersJsonPath = path.join(dataDir, 'users.json');
const seoJsonPath = path.join(dataDir, 'seo-settings.json');
const patientsJsonPath = path.join(dataDir, 'patients.json');

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

function toMySQLDateTime(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 23).replace('T', ' ');
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 23).replace('T', ' ');
  }

  return date.toISOString().slice(0, 23).replace('T', ' ');
}

function parseJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
}

function stringifyOrNull(value) {
  if (value === undefined || value === null) {
    return null;
  }
  return JSON.stringify(value);
}

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

async function seedUsers(connection, usersData) {
  if (!Array.isArray(usersData) || usersData.length === 0) {
    console.log('No users data found to seed.');
    return 0;
  }

  const sql = `
    INSERT INTO users (
      id, email, password, name, role, slug, specialty, specialties, location,
      conditions, bio, image, contact, education, certifications, brandColor,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      password = VALUES(password),
      name = VALUES(name),
      role = VALUES(role),
      slug = VALUES(slug),
      specialty = VALUES(specialty),
      specialties = VALUES(specialties),
      location = VALUES(location),
      conditions = VALUES(conditions),
      bio = VALUES(bio),
      image = VALUES(image),
      contact = VALUES(contact),
      education = VALUES(education),
      certifications = VALUES(certifications),
      brandColor = VALUES(brandColor),
      createdAt = VALUES(createdAt),
      updatedAt = VALUES(updatedAt)
  `;

  let count = 0;
  for (const user of usersData) {
    await connection.query(sql, [
      user.id,
      user.email,
      user.password,
      user.name,
      user.role,
      user.slug || null,
      user.specialty || null,
      stringifyOrNull(user.specialties),
      stringifyOrNull(user.location),
      stringifyOrNull(user.conditions),
      user.bio || null,
      user.image || null,
      stringifyOrNull(user.contact),
      stringifyOrNull(user.education),
      stringifyOrNull(user.certifications),
      user.brandColor || null,
      toMySQLDateTime(user.createdAt),
      user.updatedAt ? toMySQLDateTime(user.updatedAt) : null,
    ]);
    count += 1;
  }

  return count;
}

async function seedSeoSettings(connection, seoData) {
  if (!seoData || typeof seoData !== 'object') {
    console.log('No SEO settings data found to seed.');
    return 0;
  }

  const entries = Object.entries(seoData);
  if (entries.length === 0) {
    console.log('SEO settings JSON is empty.');
    return 0;
  }

  const sql = `
    INSERT INTO seo_settings (settings_key, settings_value)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      settings_value = VALUES(settings_value)
  `;

  let count = 0;
  for (const [settingsKey, settingsValue] of entries) {
    await connection.query(sql, [settingsKey, JSON.stringify(settingsValue)]);
    count += 1;
  }

  return count;
}

async function seedPatients(connection, patientsData) {
  if (!Array.isArray(patientsData) || patientsData.length === 0) {
    console.log('No patients data found to seed.');
    return 0;
  }

  const sql = `
    INSERT INTO patients (
      id, name, email, phone, dateOfBirth, gender, address, city, state, zipCode,
      medicalHistory, allergies, medications, emergencyContact, doctorId, userId, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      email = VALUES(email),
      phone = VALUES(phone),
      dateOfBirth = VALUES(dateOfBirth),
      gender = VALUES(gender),
      address = VALUES(address),
      city = VALUES(city),
      state = VALUES(state),
      zipCode = VALUES(zipCode),
      medicalHistory = VALUES(medicalHistory),
      allergies = VALUES(allergies),
      medications = VALUES(medications),
      emergencyContact = VALUES(emergencyContact),
      doctorId = VALUES(doctorId),
      userId = VALUES(userId),
      createdAt = VALUES(createdAt),
      updatedAt = VALUES(updatedAt)
  `;

  let count = 0;
  for (const patient of patientsData) {
    await connection.query(sql, [
      patient.id,
      patient.name,
      patient.email || null,
      patient.phone || null,
      patient.dateOfBirth || null,
      patient.gender || null,
      patient.address || null,
      patient.city || null,
      patient.state || null,
      patient.zipCode || null,
      patient.medicalHistory || null,
      stringifyOrNull(patient.allergies),
      stringifyOrNull(patient.medications),
      stringifyOrNull(patient.emergencyContact),
      patient.doctorId || null,
      patient.userId,
      toMySQLDateTime(patient.createdAt),
      toMySQLDateTime(patient.updatedAt),
    ]);
    count += 1;
  }

  return count;
}

function deleteJsonFiles() {
  if (fs.existsSync(usersJsonPath)) {
    fs.unlinkSync(usersJsonPath);
    console.log('Deleted: data/users.json');
  }
  if (fs.existsSync(seoJsonPath)) {
    fs.unlinkSync(seoJsonPath);
    console.log('Deleted: data/seo-settings.json');
  }
  if (fs.existsSync(patientsJsonPath)) {
    fs.unlinkSync(patientsJsonPath);
    console.log('Deleted: data/patients.json');
  }
}

async function initMySQLTablesAndSeed() {
  const host = process.env.DB_HOST || 'localhost';
  const port = toInt(process.env.DB_PORT, 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = safeIdentifier(process.env.DB_NAME, 'doctor_directory_mysql');

  const usersData = parseJsonFile(usersJsonPath, []);
  const seoData = parseJsonFile(seoJsonPath, {});
  const patientsData = parseJsonFile(patientsJsonPath, []);

  let rootConnection;
  let dbConnection;

  try {
    rootConnection = await mysql.createConnection({ host, port, user, password });
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    console.log(`Database ready: ${database}`);

    dbConnection = await mysql.createConnection({ host, port, user, password, database });
    await dbConnection.beginTransaction();

    await createTables(dbConnection);
    console.log('Tables ready: users, seo_settings, patients');

    const usersSeeded = await seedUsers(dbConnection, usersData);
    const seoSeeded = await seedSeoSettings(dbConnection, seoData);
    const patientsSeeded = await seedPatients(dbConnection, patientsData);

    await dbConnection.commit();
    console.log(`Seed complete: users=${usersSeeded}, seo_settings=${seoSeeded}, patients=${patientsSeeded}`);

    deleteJsonFiles();
    console.log('Migration done: JSON data moved to MySQL and JSON files removed.');
  } catch (error) {
    if (dbConnection) {
      await dbConnection.rollback();
    }
    console.error('Failed to initialize/seed MySQL:', error.message);
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

initMySQLTablesAndSeed();
