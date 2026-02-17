/**
 * Utility functions for Doctor Directory
 * 
 * Note: These functions are for server-side use only.
 * For client-side, use API routes instead.
 */

import { Doctor } from '@/types/doctor';

// Server-side only imports (will be tree-shaken in client)
let getAllDoctorsFromDb: () => Doctor[];
let getPublicDoctors: () => Doctor[];
let getDoctorBySlugFromDb: (slug: string) => Doctor | undefined;

// Lazy load server-side functions to avoid client-side import
if (typeof window === 'undefined') {
  const db = require('@/lib/db');
  getAllDoctorsFromDb = db.getAllDoctors;
  getPublicDoctors = db.getPublicDoctors;
  getDoctorBySlugFromDb = db.getDoctorBySlug;
}

/**
 * Loads all public doctors (without userId or userId is null)
 * 
 * SERVER-SIDE ONLY - Use API route for client-side
 * 
 * @returns Array of public doctors (for directory display)
 */
export function getAllDoctors(): Doctor[] {
  if (typeof window !== 'undefined') {
    throw new Error('getAllDoctors() can only be used server-side. Use /api/doctors/public for client-side.');
  }
  return getPublicDoctors();
}

/**
 * Finds a doctor by slug
 * 
 * SERVER-SIDE ONLY
 * 
 * @param slug - URL-friendly identifier for the doctor
 * @returns Doctor object if found, undefined otherwise
 */
export function getDoctorBySlug(slug: string): Doctor | undefined {
  if (typeof window !== 'undefined') {
    throw new Error('getDoctorBySlug() can only be used server-side.');
  }
  return getDoctorBySlugFromDb(slug);
}

/**
 * Generates all doctor slugs for static generation
 * 
 * SERVER-SIDE ONLY
 * 
 * @returns Array of doctor slugs (includes both public and user doctors)
 */
export function getAllDoctorSlugs(): string[] {
  if (typeof window !== 'undefined') {
    throw new Error('getAllDoctorSlugs() can only be used server-side.');
  }
  const doctors = getAllDoctorsFromDb();
  return doctors.map(doctor => doctor.slug);
}
