'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { Doctor } from '@/types/doctor';

export default function DoctorDetailPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token && params.id) {
      fetchDoctor();
    }
  }, [user, token, params.id]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctor(data.doctor);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
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

  if (!user || !doctor) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard/doctors"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Doctors
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {doctor.brandColor && (
            <div
              className="h-2 w-full"
              style={{ backgroundColor: doctor.brandColor }}
            />
          )}

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <p
                  className="text-xl font-semibold mb-4"
                  style={{ color: doctor.brandColor || '#3B82F6' }}
                >
                  {doctor.specialty}
                </p>
                <p className="text-gray-600">
                  {doctor.location.city}, {doctor.location.state}
                </p>
              </div>
              <Link
                href={`/dashboard/doctors/${doctor.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit
              </Link>
            </div>

            <div className="space-y-6">
              {doctor.specialties && doctor.specialties.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {doctor.bio && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Biography</h3>
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>
              )}

              {doctor.conditions && doctor.conditions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Conditions Treated</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {doctor.contact && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    {doctor.contact.phone && (
                      <p className="text-gray-700">Phone: {doctor.contact.phone}</p>
                    )}
                    {doctor.contact.email && (
                      <p className="text-gray-700">Email: {doctor.contact.email}</p>
                    )}
                    {doctor.contact.website && (
                      <p className="text-gray-700">
                        Website:{' '}
                        <a
                          href={doctor.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {doctor.contact.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {doctor.location.address && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Address</h3>
                  <p className="text-gray-700">
                    {doctor.location.address}
                    {doctor.location.zipCode && `, ${doctor.location.zipCode}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
