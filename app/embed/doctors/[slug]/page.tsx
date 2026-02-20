/**
 * Widget Doctor Profile Page
 * 
 * Patient-facing doctor profile page for widget/embed context.
 * This is a read-only version optimized for iframe embedding.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Doctor } from '@/types/doctor';

export default function WidgetDoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const slug = params.slug as string;
        const response = await fetch(`/api/doctors/slug/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setDoctor(data.doctor);
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        setError('Failed to load doctor');
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchDoctor();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The doctor profile you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/embed')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ minHeight: '100vh' }}>
      {/* Header with Back Button */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/embed')}
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center mb-4"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Directory
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <article className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
          {/* Doctor Header */}
          <header className="mb-6 pb-6 border-b border-gray-200">
            {/* Profile Image */}
            {doctor.image ? (
              <div className="relative w-full max-w-xs h-64 mb-6 rounded-lg overflow-hidden bg-gray-100 mx-auto md:mx-0">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                />
              </div>
            ) : (
              <div className="w-full max-w-xs h-64 mb-6 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto md:mx-0">
                <svg
                  className="w-24 h-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {doctor.name}
            </h1>
            <p className="text-xl text-blue-600 font-medium mb-4">
              {doctor.specialty}
            </p>
            <div className="text-gray-600">
              <p className="font-medium">
                {doctor.location.city}, {doctor.location.state}
              </p>
              {doctor.location.address && (
                <p className="text-sm mt-1">{doctor.location.address}</p>
              )}
            </div>
          </header>

          {/* Biography */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="whitespace-pre-line">{doctor.bio}</p>
            </div>
          </section>

          {/* Specialties */}
          {doctor.specialties.length > 1 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Specialties
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {doctor.specialties.map((specialty, index) => (
                  <li key={index}>{specialty}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Conditions */}
          {doctor.conditions && doctor.conditions.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Conditions Treated
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {doctor.education && doctor.education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Education
              </h2>
              <ul className="space-y-3">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="text-gray-700">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm">{edu.institution}</p>
                    {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {doctor.certifications && doctor.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Certifications
              </h2>
              <ul className="space-y-3">
                {doctor.certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700">
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm">{cert.issuingOrganization}</p>
                    {cert.year && <p className="text-sm text-gray-500">{cert.year}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contact Information */}
          {doctor.contact && (
            <section className="mb-8 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <div className="space-y-2 text-gray-700">
                {doctor.contact.phone && (
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {doctor.contact.phone}
                  </p>
                )}
                {doctor.contact.email && (
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${doctor.contact.email}`} className="text-blue-600 hover:underline">
                      {doctor.contact.email}
                    </a>
                  </p>
                )}
                {doctor.contact.website && (
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={doctor.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {doctor.contact.website}
                    </a>
                  </p>
                )}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
}
