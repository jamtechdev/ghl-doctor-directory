/**
 * Filter functionality for Doctor Directory
 * 
 * This module implements multi-select filtering for specialties and states.
 * 
 * Filter Logic:
 * - Within each filter category (Specialty, State): OR logic (match ANY selected)
 * - Between filter categories: AND logic (must match ALL selected categories)
 * 
 * Example:
 * - Selected: Specialty=["Orthopedic Surgery", "Cardiology"], State=["NY", "CA"]
 * - Result: Doctors who are (Orthopedic Surgery OR Cardiology) AND (in NY OR CA)
 * 
 * How to use:
 * 1. Get available filter options using getFilterOptions()
 * 2. Apply filters using filterDoctors()
 * 3. Combine with search results for final filtered list
 */

import { Doctor } from '@/types/doctor';

/**
 * Filter options extracted from doctor data
 */
export interface FilterOptions {
  specialties: string[];
  states: string[];
}

/**
 * Active filter selections
 */
export interface ActiveFilters {
  specialties: string[];
  states: string[];
}

/**
 * Extracts all available filter options from doctor data
 * 
 * This function scans all doctors and collects unique:
 * - Specialties (from specialties array)
 * - States (from location.state)
 * 
 * Use this to populate filter UI components.
 * 
 * @param doctors - Array of all doctors
 * @returns Object containing arrays of unique specialties and states
 */
export function getFilterOptions(doctors: Doctor[]): FilterOptions {
  const specialtiesSet = new Set<string>();
  const statesSet = new Set<string>();

  doctors.forEach(doctor => {
    // Add all specialties (including primary specialty)
    doctor.specialties.forEach(specialty => {
      specialtiesSet.add(specialty);
    });

    // Add state
    statesSet.add(doctor.location.state);
  });

  return {
    specialties: Array.from(specialtiesSet).sort(),
    states: Array.from(statesSet).sort(),
  };
}

/**
 * Filters doctors based on selected specialties and states
 * 
 * Filter Logic:
 * - Specialty filter: OR logic (doctor matches if ANY selected specialty matches)
 * - State filter: OR logic (doctor matches if ANY selected state matches)
 * - Between filters: AND logic (doctor must match specialty filter AND state filter)
 * 
 * If a filter category is empty (no selections), it doesn't filter that category.
 * 
 * @param doctors - Array of doctors to filter
 * @param filters - Active filter selections
 * @returns Filtered array of doctors
 */
export function filterDoctors(
  doctors: Doctor[],
  filters: ActiveFilters
): Doctor[] {
  let filtered = doctors;

  // Apply specialty filter (OR logic: match ANY selected specialty)
  if (filters.specialties.length > 0) {
    filtered = filtered.filter(doctor =>
      // Check if doctor has ANY of the selected specialties
      doctor.specialties.some(specialty =>
        filters.specialties.includes(specialty)
      )
    );
  }

  // Apply state filter (OR logic: match ANY selected state)
  if (filters.states.length > 0) {
    filtered = filtered.filter(doctor =>
      filters.states.includes(doctor.location.state)
    );
  }

  return filtered;
}

/**
 * Checks if any filters are currently active
 * 
 * @param filters - Active filter selections
 * @returns True if at least one filter category has selections
 */
export function hasActiveFilters(filters: ActiveFilters): boolean {
  return filters.specialties.length > 0 || filters.states.length > 0;
}

/**
 * Resets all filters to empty state
 * 
 * @returns Empty filter object
 */
export function resetFilters(): ActiveFilters {
  return {
    specialties: [],
    states: [],
  };
}
