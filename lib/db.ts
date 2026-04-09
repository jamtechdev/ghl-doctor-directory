/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcryptjs';
import mysql, { Pool } from 'mysql2/promise';
import { Doctor, Location, Contact, Education, Certification } from '@/types/doctor';
import { Patient } from '@/types/patient';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number.parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'doctor_directory_mysql',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function checkDbHealth(): Promise<{ ok: boolean; message: string }> {
  try {
    const [rows] = await getPool().query('SELECT 1 AS ok');
    const ok = Array.isArray(rows) && (rows as any[])[0]?.ok === 1;
    return ok
      ? { ok: true, message: 'MySQL connection is healthy' }
      : { ok: false, message: 'MySQL ping query failed' };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

function parseJSONField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

// Base User interface
export interface BaseUser {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: 'admin' | 'doctor';
  createdAt: string;
  updatedAt?: string;
}

// Admin User (no additional fields)
export interface AdminUser extends BaseUser {
  role: 'admin';
}

// Doctor User (includes all doctor profile fields)
export interface DoctorUser extends BaseUser {
  role: 'doctor';
  slug: string;
  specialty: string;
  specialties: string[];
  location: Location;
  conditions: string[];
  bio: string;
  image?: string;
  contact?: Contact;
  education?: Education[];
  certifications?: Certification[];
  brandColor?: string;
}

// Union type for User
export type User = AdminUser | DoctorUser;

function dbRowToUser(row: any): User {
  const base = {
    id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    role: row.role,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  } as BaseUser;

  if (row.role === 'doctor') {
    return {
      ...base,
      role: 'doctor',
      slug: row.slug || '',
      specialty: row.specialty || '',
      specialties: parseJSONField<string[]>(row.specialties, []),
      location: parseJSONField<Location>(row.location, { city: '', state: '' }),
      conditions: parseJSONField<string[]>(row.conditions, []),
      bio: row.bio || '',
      image: row.image || undefined,
      contact: parseJSONField<Contact | undefined>(row.contact, undefined),
      education: parseJSONField<Education[] | undefined>(row.education, undefined),
      certifications: parseJSONField<Certification[] | undefined>(row.certifications, undefined),
      brandColor: row.brandColor || undefined,
    } as DoctorUser;
  }

  return { ...base, role: 'admin' } as AdminUser;
}

function dbRowToDoctor(row: any): Doctor {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    specialty: row.specialty,
    specialties: parseJSONField<string[]>(row.specialties, []),
    location: parseJSONField<Location>(row.location, { city: '', state: '' }),
    conditions: parseJSONField<string[]>(row.conditions, []),
    bio: row.bio || '',
    image: row.image || undefined,
    contact: parseJSONField<Contact | undefined>(row.contact, undefined),
    education: parseJSONField<Education[] | undefined>(row.education, undefined),
    certifications: parseJSONField<Certification[] | undefined>(row.certifications, undefined),
    brandColor: row.brandColor || undefined,
    userId: null,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  };
}

function dbRowToPatient(row: any): Patient {
  return {
    id: row.id,
    name: row.name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth).toISOString().slice(0, 10) : undefined,
    gender: row.gender || undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    state: row.state || undefined,
    zipCode: row.zipCode || undefined,
    medicalHistory: row.medicalHistory || undefined,
    allergies: parseJSONField<string[] | undefined>(row.allergies, []),
    medications: parseJSONField<string[] | undefined>(row.medications, []),
    emergencyContact: parseJSONField<Patient['emergencyContact'] | undefined>(row.emergencyContact, undefined),
    doctorId: row.doctorId || undefined,
    userId: row.userId,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

// Users database functions
export async function getUsers(): Promise<User[]> {
  const [rows] = await getPool().query('SELECT * FROM users ORDER BY createdAt ASC');
  return (rows as any[]).map(dbRowToUser);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const row = (rows as any[])[0];
  return row ? dbRowToUser(row) : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [rows] = await getPool().query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  const row = (rows as any[])[0];
  return row ? dbRowToUser(row) : undefined;
}

export async function createUser(user: Omit<BaseUser, 'id' | 'createdAt'> & Partial<Omit<DoctorUser, keyof BaseUser>>): Promise<User> {
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
  const createdAt = new Date();
  const updatedAt = new Date();
  const role = user.role || 'admin';

  await getPool().query(
    `INSERT INTO users (
      id, email, password, name, role, slug, specialty, specialties, location, conditions,
      bio, image, contact, education, certifications, brandColor, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      user.email,
      user.password,
      user.name,
      role,
      user.slug || null,
      user.specialty || null,
      user.specialties ? JSON.stringify(user.specialties) : null,
      user.location ? JSON.stringify(user.location) : null,
      user.conditions ? JSON.stringify(user.conditions) : null,
      user.bio || null,
      user.image || null,
      user.contact ? JSON.stringify(user.contact) : null,
      user.education ? JSON.stringify(user.education) : null,
      user.certifications ? JSON.stringify(user.certifications) : null,
      user.brandColor || null,
      createdAt,
      updatedAt,
    ]
  );

  const saved = await getUserById(id);
  if (!saved) throw new Error('Failed to create user');
  return saved;
}

// Doctors database functions
export async function getAllDoctors(): Promise<Doctor[]> {
  const [rows] = await getPool().query(`SELECT * FROM users WHERE role = 'doctor' ORDER BY createdAt DESC`);
  return (rows as any[]).map(dbRowToDoctor);
}

export async function getDoctorsByUserId(userId: string): Promise<Doctor[]> {
  const doctor = await getDoctorById(userId);
  return doctor ? [doctor] : [];
}

export async function getPublicDoctors(): Promise<Doctor[]> {
  return getAllDoctors();
}

export async function getDoctorById(id: string): Promise<Doctor | undefined> {
  const [rows] = await getPool().query(`SELECT * FROM users WHERE role = 'doctor' AND id = ? LIMIT 1`, [id]);
  const row = (rows as any[])[0];
  return row ? dbRowToDoctor(row) : undefined;
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | undefined> {
  const [rows] = await getPool().query(`SELECT * FROM users WHERE role = 'doctor' AND slug = ? LIMIT 1`, [slug]);
  const row = (rows as any[])[0];
  return row ? dbRowToDoctor(row) : undefined;
}

// Helper function to convert Doctor to DoctorUser format
function doctorToDoctorUser(doctor: Omit<Doctor, 'userId' | 'id' | 'createdAt' | 'updatedAt'>, email: string, password: string): Omit<DoctorUser, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    email,
    password,
    name: doctor.name,
    role: 'doctor',
    slug: doctor.slug,
    specialty: doctor.specialty,
    specialties: doctor.specialties,
    location: doctor.location,
    conditions: doctor.conditions,
    bio: doctor.bio,
    image: doctor.image,
    contact: doctor.contact,
    education: doctor.education,
    certifications: doctor.certifications,
    brandColor: doctor.brandColor,
  };
}

export async function createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { email: string; password: string }): Promise<Doctor> {
  const slug = doctor.slug || `dr-${doctor.name.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
  const hashedPassword = bcrypt.hashSync(doctor.password, 10);
  const id = Date.now().toString();
  const now = new Date();

  const doctorUser = doctorToDoctorUser({ ...doctor, slug }, doctor.email, hashedPassword);

  await getPool().query(
    `INSERT INTO users (
      id, email, password, name, role, slug, specialty, specialties, location, conditions, bio,
      image, contact, education, certifications, brandColor, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, 'doctor', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      doctorUser.email,
      doctorUser.password,
      doctorUser.name,
      doctorUser.slug,
      doctorUser.specialty,
      JSON.stringify(doctorUser.specialties || []),
      JSON.stringify(doctorUser.location || {}),
      JSON.stringify(doctorUser.conditions || []),
      doctorUser.bio,
      doctorUser.image || null,
      doctorUser.contact ? JSON.stringify(doctorUser.contact) : null,
      doctorUser.education ? JSON.stringify(doctorUser.education) : null,
      doctorUser.certifications ? JSON.stringify(doctorUser.certifications) : null,
      doctorUser.brandColor || null,
      now,
      now,
    ]
  );

  const created = await getDoctorById(id);
  if (!created) throw new Error('Failed to create doctor');
  return created;
}

export async function updateDoctor(id: string, updates: Partial<Omit<Doctor, 'id' | 'createdAt' | 'userId'>>): Promise<Doctor | null> {
  const existing = await getDoctorById(id);
  if (!existing) return null;

  await getPool().query(
    `UPDATE users SET
      name = ?, specialty = ?, specialties = ?, location = ?, conditions = ?, bio = ?, image = ?,
      contact = ?, education = ?, certifications = ?, brandColor = ?, updatedAt = ?
     WHERE id = ? AND role = 'doctor'`,
    [
      updates.name ?? existing.name,
      updates.specialty ?? existing.specialty,
      JSON.stringify(updates.specialties ?? existing.specialties ?? []),
      JSON.stringify(updates.location ?? existing.location ?? {}),
      JSON.stringify(updates.conditions ?? existing.conditions ?? []),
      updates.bio ?? existing.bio,
      updates.image ?? existing.image ?? null,
      JSON.stringify(updates.contact ?? existing.contact ?? null),
      JSON.stringify(updates.education ?? existing.education ?? null),
      JSON.stringify(updates.certifications ?? existing.certifications ?? null),
      updates.brandColor ?? existing.brandColor ?? null,
      new Date(),
      id,
    ]
  );

  return (await getDoctorById(id)) || null;
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const [result] = await getPool().query(`DELETE FROM users WHERE id = ? AND role = 'doctor'`, [id]);
  return (result as any).affectedRows > 0;
}

// Patients database functions
export async function getAllPatients(): Promise<Patient[]> {
  const [rows] = await getPool().query('SELECT * FROM patients ORDER BY createdAt DESC');
  return (rows as any[]).map(dbRowToPatient);
}

export async function getPatientsByUserId(userId: string): Promise<Patient[]> {
  const [rows] = await getPool().query('SELECT * FROM patients WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  return (rows as any[]).map(dbRowToPatient);
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  const [rows] = await getPool().query('SELECT * FROM patients WHERE id = ? LIMIT 1', [id]);
  const row = (rows as any[])[0];
  return row ? dbRowToPatient(row) : undefined;
}

export async function createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);
  const now = new Date();

  await getPool().query(
    `INSERT INTO patients (
      id, name, email, phone, dateOfBirth, gender, address, city, state, zipCode,
      medicalHistory, allergies, medications, emergencyContact, doctorId, userId, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
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
      JSON.stringify(patient.allergies || []),
      JSON.stringify(patient.medications || []),
      patient.emergencyContact ? JSON.stringify(patient.emergencyContact) : null,
      patient.doctorId || null,
      patient.userId,
      now,
      now,
    ]
  );

  const created = await getPatientById(id);
  if (!created) throw new Error('Failed to create patient');
  return created;
}

export async function updatePatient(id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt' | 'userId'>>): Promise<Patient | null> {
  const existing = await getPatientById(id);
  if (!existing) return null;

  await getPool().query(
    `UPDATE patients SET
      name = ?, email = ?, phone = ?, dateOfBirth = ?, gender = ?, address = ?, city = ?, state = ?, zipCode = ?,
      medicalHistory = ?, allergies = ?, medications = ?, emergencyContact = ?, doctorId = ?, updatedAt = ?
     WHERE id = ?`,
    [
      updates.name ?? existing.name,
      updates.email ?? existing.email ?? null,
      updates.phone ?? existing.phone ?? null,
      updates.dateOfBirth ?? existing.dateOfBirth ?? null,
      updates.gender ?? existing.gender ?? null,
      updates.address ?? existing.address ?? null,
      updates.city ?? existing.city ?? null,
      updates.state ?? existing.state ?? null,
      updates.zipCode ?? existing.zipCode ?? null,
      updates.medicalHistory ?? existing.medicalHistory ?? null,
      JSON.stringify(updates.allergies ?? existing.allergies ?? []),
      JSON.stringify(updates.medications ?? existing.medications ?? []),
      JSON.stringify(updates.emergencyContact ?? existing.emergencyContact ?? null),
      updates.doctorId ?? existing.doctorId ?? null,
      new Date(),
      id,
    ]
  );

  return (await getPatientById(id)) || null;
}

export async function deletePatient(id: string): Promise<boolean> {
  const [result] = await getPool().query('DELETE FROM patients WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

export async function getSEOSettings(): Promise<any> {
  const [rows] = await getPool().query('SELECT settings_key, settings_value FROM seo_settings');
  const settings: any = {};
  for (const row of rows as any[]) {
    settings[row.settings_key] = parseJSONField<any>(row.settings_value, {});
  }
  return settings;
}

export async function saveSEOSettings(settings: any): Promise<void> {
  const entries = Object.entries(settings || {});
  for (const [key, value] of entries) {
    await getPool().query(
      `INSERT INTO seo_settings (settings_key, settings_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE settings_value = VALUES(settings_value)`,
      [key, JSON.stringify(value)]
    );
  }
}
