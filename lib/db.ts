import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Doctor, Location, Contact, Education, Certification } from '@/types/doctor';
import { Patient } from '@/types/patient';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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

// Users database functions
export function getUsers(): User[] {
  const filePath = path.join(dataDir, 'users.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function saveUsers(users: User[]): void {
  const filePath = path.join(dataDir, 'users.json');
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email === email);
}

export function getUserById(id: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function createUser(user: Omit<BaseUser, 'id' | 'createdAt'> & Partial<Omit<DoctorUser, keyof BaseUser>>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    role: user.role || 'admin',
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as User;
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Doctors database functions (using users.json with role='doctor')
export function getAllDoctors(): Doctor[] {
  const users = getUsers();
  return users.filter((user): user is DoctorUser => user.role === 'doctor').map(doctorUserToDoctor);
}

export function getDoctorsByUserId(userId: string): Doctor[] {
  const users = getUsers();
  return users.filter((user): user is DoctorUser => user.role === 'doctor' && user.id === userId).map(doctorUserToDoctor);
}

export function getPublicDoctors(): Doctor[] {
  // All doctors are public now (no userId filtering)
  return getAllDoctors();
}

export function getDoctorById(id: string): Doctor | undefined {
  const users = getUsers();
  const doctorUser = users.find((user): user is DoctorUser => user.role === 'doctor' && user.id === id);
  return doctorUser ? doctorUserToDoctor(doctorUser) : undefined;
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  const users = getUsers();
  const doctorUser = users.find((user): user is DoctorUser => user.role === 'doctor' && user.slug === slug);
  return doctorUser ? doctorUserToDoctor(doctorUser) : undefined;
}

// Helper function to convert DoctorUser to Doctor format
function doctorUserToDoctor(doctorUser: DoctorUser): Doctor {
  return {
    id: doctorUser.id,
    slug: doctorUser.slug,
    name: doctorUser.name,
    specialty: doctorUser.specialty,
    specialties: doctorUser.specialties,
    location: doctorUser.location,
    conditions: doctorUser.conditions,
    bio: doctorUser.bio,
    image: doctorUser.image,
    contact: doctorUser.contact,
    education: doctorUser.education,
    certifications: doctorUser.certifications,
    brandColor: doctorUser.brandColor,
    userId: null, // Not used anymore, but kept for compatibility
    createdAt: doctorUser.createdAt,
    updatedAt: doctorUser.updatedAt,
  };
}

// Helper function to convert Doctor to DoctorUser format
function doctorToDoctorUser(doctor: Omit<Doctor, 'userId'>, email: string, password: string): Omit<DoctorUser, 'id' | 'createdAt' | 'updatedAt'> {
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

export function createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { email: string; password: string }): Doctor {
  const users = getUsers();
  const slug = doctor.slug || `dr-${doctor.name.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
  
  // Hash the password
  const hashedPassword = bcrypt.hashSync(doctor.password, 10);
  
  // Auto-increment ID: Find the highest numeric ID among doctors
  const doctorIds = users
    .filter((u): u is DoctorUser => u.role === 'doctor')
    .map(u => {
      const numId = parseInt(u.id);
      return isNaN(numId) ? 0 : numId;
    });
  const maxId = doctorIds.length > 0 ? Math.max(...doctorIds) : 0;
  const newId = (maxId + 1).toString();
  
  const doctorUser: DoctorUser = {
    ...doctorToDoctorUser({ ...doctor, slug }, doctor.email, hashedPassword),
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(doctorUser);
  saveUsers(users);
  return doctorUserToDoctor(doctorUser);
}

export function updateDoctor(id: string, updates: Partial<Omit<Doctor, 'id' | 'createdAt' | 'userId'>>): Doctor | null {
  const users = getUsers();
  const index = users.findIndex((user): user is DoctorUser => user.role === 'doctor' && user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const doctorUser = users[index] as DoctorUser;
  const updatedDoctorUser: DoctorUser = {
    ...doctorUser,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  users[index] = updatedDoctorUser;
  saveUsers(users);
  return doctorUserToDoctor(updatedDoctorUser);
}

export function deleteDoctor(id: string): boolean {
  const users = getUsers();
  const index = users.findIndex((user): user is DoctorUser => user.role === 'doctor' && user.id === id);
  
  if (index === -1) {
    return false;
  }
  
  users.splice(index, 1);
  saveUsers(users);
  return true;
}

// Patients database functions
export function getAllPatients(): Patient[] {
  const filePath = path.join(dataDir, 'patients.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function savePatients(patients: Patient[]): void {
  const filePath = path.join(dataDir, 'patients.json');
  fs.writeFileSync(filePath, JSON.stringify(patients, null, 2));
}

export function getPatientsByUserId(userId: string): Patient[] {
  const patients = getAllPatients();
  return patients.filter(patient => patient.userId === userId);
}

export function getPatientById(id: string): Patient | undefined {
  const patients = getAllPatients();
  return patients.find(patient => patient.id === id);
}

export function createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
  const patients = getAllPatients();
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
}

export function updatePatient(id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt' | 'userId'>>): Patient | null {
  const patients = getAllPatients();
  const index = patients.findIndex(patient => patient.id === id);
  if (index === -1) {
    return null;
  }
  patients[index] = {
    ...patients[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  savePatients(patients);
  return patients[index];
}

export function deletePatient(id: string): boolean {
  const patients = getAllPatients();
  const index = patients.findIndex(patient => patient.id === id);
  if (index === -1) {
    return false;
  }
  patients.splice(index, 1);
  savePatients(patients);
  return true;
}
