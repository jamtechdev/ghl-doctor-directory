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
  const [imageError, setImageError] = useState(false);

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard/doctors"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Doctors
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {doctor.brandColor && (
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: doctor.brandColor }}
            />
          )}

          <div className="p-6 md:p-8">
            {/* Header Section with Image */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200">
              {/* Image/Avatar */}
              <div className="flex-shrink-0">
                {doctor.image && !imageError ? (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-2 ring-gray-100 flex items-center justify-center bg-gray-50">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-contain object-top transition-transform duration-300 hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg relative overflow-hidden"
                    style={{ 
                      background: doctor.brandColor 
                        ? `linear-gradient(135deg, ${doctor.brandColor} 0%, ${doctor.brandColor}dd 100%)`
                        : 'linear-gradient(135deg, #673AB7 0%, #7B1FA2 100%)'
                    }}
                  >
                    <span className="relative z-10">{getInitials(doctor.name)}</span>
                    <div className="absolute inset-0 opacity-20" style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                    }}></div>
                  </div>
                )}
              </div>

              {/* Name and Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    <p
                      className="text-xl md:text-2xl font-semibold mb-3"
                      style={{ color: doctor.brandColor || '#3B82F6' }}
                    >
                      {doctor.specialty}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{doctor.location.city}, {doctor.location.state}</span>
                    </div>
                    {doctor.location.address && (
                      <p className="text-sm text-gray-500">{doctor.location.address}</p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/doctors/${doctor.id}/edit`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Biography */}
                {doctor.bio && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      About
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{doctor.bio}</p>
                  </div>
                )}

                {/* Specialties */}
                {doctor.specialties && doctor.specialties.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Specialties
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions Treated */}
                {doctor.conditions && doctor.conditions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Conditions & Treatments
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {doctor.conditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {doctor.education && doctor.education.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01" />
                      </svg>
                      Education
                    </h2>
                    <div className="space-y-3">
                      {doctor.education.map((edu, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <p className="font-semibold text-gray-900">{edu.degree}</p>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                          {edu.year && (
                            <p className="text-gray-500 text-xs mt-1">{edu.year}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {doctor.certifications && doctor.certifications.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Certifications
                    </h2>
                    <div className="space-y-3">
                      {doctor.certifications.map((cert, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
                          <p className="font-semibold text-gray-900">{cert.name}</p>
                          <p className="text-gray-600 text-sm">{cert.issuingOrganization}</p>
                          {cert.year && (
                            <p className="text-gray-500 text-xs mt-1">{cert.year}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200 sticky top-6">
                  {/* Contact Information */}
                  {doctor.contact && (doctor.contact.phone || doctor.contact.email || doctor.contact.website) && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Contact
                      </h3>
                      <div className="space-y-3">
                        {doctor.contact.phone && (
                          <a
                            href={`tel:${doctor.contact.phone}`}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-gray-900 font-medium">{doctor.contact.phone}</p>
                            </div>
                          </a>
                        )}
                        {doctor.contact.email && (
                          <a
                            href={`mailto:${doctor.contact.email}`}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-gray-900 font-medium text-sm">{doctor.contact.email}</p>
                            </div>
                          </a>
                        )}
                        {doctor.contact.website && (
                          <a
                            href={doctor.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Website</p>
                              <p className="text-gray-900 font-medium text-sm truncate">{doctor.contact.website}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </h3>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-1">{doctor.location.city}, {doctor.location.state}</p>
                      {doctor.location.address && (
                        <p className="text-gray-600 text-sm mb-1">{doctor.location.address}</p>
                      )}
                      {doctor.location.zipCode && (
                        <p className="text-gray-500 text-xs">{doctor.location.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
