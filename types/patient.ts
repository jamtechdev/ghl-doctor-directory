export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  doctorId?: string; // Link to doctor
  userId: string; // User who created this patient
  createdAt: string;
  updatedAt: string;
}
