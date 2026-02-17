import fs from 'fs';
import path from 'path';
import { Doctor } from '@/types/doctor';
import { Patient } from '@/types/patient';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

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

export function createUser(user: Omit<User, 'id' | 'createdAt' | 'role'> & { role?: 'admin' | 'user' }): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    role: user.role || 'user',
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Doctors database functions (using doctors.json)
export function getAllDoctors(): Doctor[] {
  const filePath = path.join(dataDir, 'doctors.json');
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function saveDoctors(doctors: Doctor[]): void {
  const filePath = path.join(dataDir, 'doctors.json');
  fs.writeFileSync(filePath, JSON.stringify(doctors, null, 2));
}

export function getDoctorsByUserId(userId: string): Doctor[] {
  const doctors = getAllDoctors();
  return doctors.filter(doctor => doctor.userId === userId);
}

export function getPublicDoctors(): Doctor[] {
  const doctors = getAllDoctors();
  return doctors.filter(doctor => !doctor.userId || doctor.userId === null);
}

export function getDoctorById(id: string): Doctor | undefined {
  const doctors = getAllDoctors();
  return doctors.find(doctor => doctor.id === id);
}

export function getDoctorBySlug(slug: string): Doctor | undefined {
  const doctors = getAllDoctors();
  return doctors.find(doctor => doctor.slug === slug);
}

export function createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Doctor {
  const doctors = getAllDoctors();
  const newDoctor: Doctor = {
    ...doctor,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  doctors.push(newDoctor);
  saveDoctors(doctors);
  return newDoctor;
}

export function updateDoctor(id: string, updates: Partial<Omit<Doctor, 'id' | 'createdAt' | 'userId'>>): Doctor | null {
  const doctors = getAllDoctors();
  const index = doctors.findIndex(doctor => doctor.id === id);
  if (index === -1) {
    return null;
  }
  doctors[index] = {
    ...doctors[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDoctors(doctors);
  return doctors[index];
}

export function deleteDoctor(id: string): boolean {
  const doctors = getAllDoctors();
  const index = doctors.findIndex(doctor => doctor.id === id);
  if (index === -1) {
    return false;
  }
  doctors.splice(index, 1);
  saveDoctors(doctors);
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
