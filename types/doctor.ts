/**
 * TypeScript interfaces for Doctor Directory
 * 
 * These types define the structure of doctor data used throughout the application.
 * Update these types if you need to add new fields to doctor profiles.
 */

export interface Location {
  city: string;
  state: string;
  address?: string;
  zipCode?: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year?: number;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  year?: number;
}

/**
 * Main Doctor interface
 * 
 * This represents a complete doctor profile in the directory.
 * 
 * @property id - Unique identifier for the doctor
 * @property slug - URL-friendly identifier used in routes (e.g., "dr-john-smith")
 * @property name - Full name of the doctor
 * @property specialty - Primary specialty (displayed on cards)
 * @property specialties - Array of all specialties the doctor practices
 * @property location - Location information (city, state, address)
 * @property conditions - Array of condition/injury keywords for search functionality
 *                       These keywords are matched when users search for conditions
 * @property bio - Full biography text displayed on profile page
 * @property image - Optional profile image URL
 * @property contact - Contact information (phone, email, website)
 * @property education - Array of education entries
 * @property certifications - Array of professional certifications
 * @property brandColor - Optional brand color for card accent (hex code, e.g., "#3B82F6")
 * @property userId - Optional user ID (null for public doctors, set for user-specific doctors)
 * @property createdAt - Optional creation timestamp
 * @property updatedAt - Optional update timestamp
 */
export interface Doctor {
  id: string;
  slug: string;
  name: string;
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
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
