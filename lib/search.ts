/**
 * Search functionality for Doctor Directory
 * 
 * This module implements case-insensitive, multi-keyword search that matches
 * against doctor names, specialties, and condition keywords.
 * 
 * How it works:
 * 1. Splits the search query into individual keywords (tokenization)
 * 2. For each keyword, checks if it appears in:
 *    - Doctor's name
 *    - Primary specialty
 *    - All specialties array
 *    - Conditions array (for condition/injury searches)
 * 3. Returns true only if ALL keywords match (AND logic between keywords)
 * 4. Uses case-insensitive partial matching
 * 
 * Example searches:
 * - "ACL reconstruction" → matches doctors with "ACL" AND "reconstruction" in conditions
 * - "john smith" → matches doctors with "john" AND "smith" in name
 * - "orthopedic knee" → matches doctors with both "orthopedic" in specialty AND "knee" in conditions
 */

import { Doctor } from '@/types/doctor';

/**
 * Searches doctors based on a query string
 * 
 * @param doctors - Array of doctors to search through
 * @param query - Search query (can contain multiple keywords separated by spaces)
 * @returns Array of doctors that match the search criteria
 */
export function searchDoctors(doctors: Doctor[], query: string): Doctor[] {
  // Return all doctors if query is empty
  if (!query || query.trim() === '') {
    return doctors;
  }

  // Normalize query: trim whitespace and convert to lowercase
  const normalizedQuery = query.trim().toLowerCase();

  // Split query into individual keywords (remove empty strings from split)
  const keywords = normalizedQuery
    .split(/\s+/)
    .filter(keyword => keyword.length > 0);

  // If no valid keywords after splitting, return all doctors
  if (keywords.length === 0) {
    return doctors;
  }

  // Filter doctors: a doctor matches if ALL keywords match
  return doctors.filter(doctor => matchesAllKeywords(doctor, keywords));
}

/**
 * Checks if a doctor matches all provided keywords
 * 
 * @param doctor - Doctor to check
 * @param keywords - Array of keywords that must all match
 * @returns True if all keywords match the doctor
 */
function matchesAllKeywords(doctor: Doctor, keywords: string[]): boolean {
  // Check each keyword - ALL must match
  return keywords.every(keyword => matchesKeyword(doctor, keyword));
}

/**
 * Checks if a doctor matches a single keyword
 * 
 * Searches in:
 * - Name (full name)
 * - Primary specialty
 * - All specialties array
 * - Conditions array
 * 
 * @param doctor - Doctor to check
 * @param keyword - Single keyword to match
 * @returns True if keyword matches any of the doctor's searchable fields
 */
function matchesKeyword(doctor: Doctor, keyword: string): boolean {
  // Search in name (case-insensitive)
  if (doctor.name.toLowerCase().includes(keyword)) {
    return true;
  }

  // Search in primary specialty (case-insensitive)
  if (doctor.specialty.toLowerCase().includes(keyword)) {
    return true;
  }

  // Search in all specialties array (case-insensitive)
  if (doctor.specialties.some(specialty => 
    specialty.toLowerCase().includes(keyword)
  )) {
    return true;
  }

  // Search in conditions array (case-insensitive)
  // This allows users to search for conditions/injuries like "ACL reconstruction"
  if (doctor.conditions.some(condition => 
    condition.toLowerCase().includes(keyword)
  )) {
    return true;
  }

  return false;
}
