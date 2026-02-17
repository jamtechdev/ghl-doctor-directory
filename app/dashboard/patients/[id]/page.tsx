'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Patient } from '@/types/patient';

export default function PatientDetailPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token && params.id) {
      fetchPatient();
    }
  }, [user, token, params.id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user || !patient) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard/patients"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Patients
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-teal-600 to-pink-600" />

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                {patient.dateOfBirth && (
                  <p className="text-gray-600 mb-1">Date of Birth: {formatDate(patient.dateOfBirth)}</p>
                )}
                {patient.gender && (
                  <p className="text-gray-600 capitalize">Gender: {patient.gender}</p>
                )}
              </div>
              <Link
                href={`/dashboard/patients/${patient.id}/edit`}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Edit
              </Link>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patient.email && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Email</h3>
                    <p className="text-gray-700">{patient.email}</p>
                  </div>
                )}

                {patient.phone && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Phone</h3>
                    <p className="text-gray-700">{patient.phone}</p>
                  </div>
                )}

                {patient.city && patient.state && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h3>
                    <p className="text-gray-700">
                      {patient.city}, {patient.state}
                      {patient.zipCode && ` ${patient.zipCode}`}
                    </p>
                  </div>
                )}

                {patient.address && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</h3>
                    <p className="text-gray-700">{patient.address}</p>
                  </div>
                )}
              </div>

              {patient.medicalHistory && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Medical History</h3>
                  <p className="text-gray-700 leading-relaxed">{patient.medicalHistory}</p>
                </div>
              )}

              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.medications && patient.medications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications.map((medication, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.emergencyContact && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Emergency Contact</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">{patient.emergencyContact.name}</p>
                    <p className="text-gray-600 text-sm">{patient.emergencyContact.relationship}</p>
                    <p className="text-gray-700">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
