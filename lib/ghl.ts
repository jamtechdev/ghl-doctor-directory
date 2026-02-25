/**
 * GoHighLevel API Integration
 * Handles syncing doctors to GHL as contacts
 */

interface GHLConfig {
  apiKey?: string;
  locationId?: string;
  enabled?: boolean;
}

interface GHLContact {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  website?: string;
  tags?: string[];
  customFields?: Array<{
    key: string;
    value: string;
  }>;
}

import fs from 'fs';
import path from 'path';

/**
 * Get GHL configuration from data file
 */
export function getGHLConfig(): GHLConfig {
  const dataDir = path.join(process.cwd(), 'data');
  const configPath = path.join(dataDir, 'ghl-config.json');

  if (!fs.existsSync(configPath)) {
    return { enabled: false };
  }

  try {
    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading GHL config:', error);
    return { enabled: false };
  }
}

/**
 * Save GHL configuration to data file
 */
export function saveGHLConfig(config: GHLConfig): void {
  const dataDir = path.join(process.cwd(), 'data');
  const configPath = path.join(dataDir, 'ghl-config.json');

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

/**
 * Create or update a contact in GoHighLevel
 */
export async function syncDoctorToGHL(doctor: any): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const config = getGHLConfig();

  // Check if GHL integration is enabled
  if (!config.enabled || !config.apiKey || !config.locationId) {
    return { success: false, error: 'GHL integration not configured' };
  }

  try {
    // Parse doctor name into first and last name
    const nameParts = doctor.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build contact data
    const contactData: GHLContact = {
      firstName,
      lastName,
      email: doctor.contact?.email || doctor.email,
      phone: doctor.contact?.phone,
      address1: doctor.location?.address,
      city: doctor.location?.city,
      state: doctor.location?.state,
      postalCode: doctor.location?.zipCode,
      website: doctor.contact?.website,
      tags: ['Doctor', doctor.specialty, ...(doctor.specialties || [])].filter(Boolean),
      customFields: [
        { key: 'Specialty', value: doctor.specialty },
        { key: 'Specialties', value: (doctor.specialties || []).join(', ') },
        { key: 'Bio', value: doctor.bio || '' },
        { key: 'Conditions', value: (doctor.conditions || []).join(', ') },
        { key: 'Doctor ID', value: doctor.id },
        { key: 'Doctor Slug', value: doctor.slug },
      ].filter(field => field.value),
    };

    // Check if contact already exists by email
    const existingContact = await findContactByEmail(config.apiKey!, config.locationId!, contactData.email || '');

    let contactId: string | undefined;

    if (existingContact) {
      // Update existing contact
      contactId = await updateContact(config.apiKey!, config.locationId!, existingContact.id, contactData);
    } else {
      // Create new contact
      contactId = await createContact(config.apiKey!, config.locationId!, contactData);
    }

    return { success: true, contactId };
  } catch (error: any) {
    console.error('Error syncing doctor to GHL:', error);
    return { success: false, error: error.message || 'Failed to sync to GHL' };
  }
}

/**
 * Delete a contact from GoHighLevel
 */
export async function deleteDoctorFromGHL(doctor: any): Promise<{ success: boolean; error?: string }> {
  const config = getGHLConfig();

  if (!config.enabled || !config.apiKey || !config.locationId) {
    return { success: false, error: 'GHL integration not configured' };
  }

  try {
    const email = doctor.contact?.email || doctor.email;
    if (!email) {
      return { success: false, error: 'No email found for doctor' };
    }

    const contact = await findContactByEmail(config.apiKey!, config.locationId!, email);
    if (contact) {
      await deleteContact(config.apiKey!, config.locationId!, contact.id);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting doctor from GHL:', error);
    return { success: false, error: error.message || 'Failed to delete from GHL' };
  }
}

/**
 * Find contact by email in GHL
 */
async function findContactByEmail(apiKey: string, locationId: string, email: string): Promise<any | null> {
  if (!email) return null;

  try {
    const response = await fetch(`https://services.leadconnector.com/v1/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: JSON.stringify({
        locationId,
        query: {
          email: email,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GHL API error: ${response.status}`);
    }

    const data = await response.json();
    return data.contacts && data.contacts.length > 0 ? data.contacts[0] : null;
  } catch (error) {
    console.error('Error finding contact in GHL:', error);
    return null;
  }
}

/**
 * Create a new contact in GHL
 */
async function createContact(apiKey: string, locationId: string, contactData: GHLContact): Promise<string> {
  const response = await fetch(`https://services.leadconnector.com/v1/contacts/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({
      locationId,
      ...contactData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to create contact in GHL: ${response.status} - ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return data.contact?.id || data.id;
}

/**
 * Update an existing contact in GHL
 */
async function updateContact(apiKey: string, locationId: string, contactId: string, contactData: GHLContact): Promise<string> {
  const response = await fetch(`https://services.leadconnector.com/v1/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify({
      locationId,
      ...contactData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to update contact in GHL: ${response.status} - ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return data.contact?.id || contactId;
}

/**
 * Delete a contact from GHL
 */
async function deleteContact(apiKey: string, locationId: string, contactId: string): Promise<void> {
  const response = await fetch(`https://services.leadconnector.com/v1/contacts/${contactId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to delete contact from GHL: ${response.status} - ${errorData.message || response.statusText}`);
  }
}
