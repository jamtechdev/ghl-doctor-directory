'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Doctor } from '@/types/doctor';
import AppLayout from './AppLayout';
import { useAuth } from '@/contexts/AuthContext';

interface DoctorProfileContentProps {
  doctor: Doctor;
  doctorSchema: any;
}

export default function DoctorProfileContent({ doctor, doctorSchema }: DoctorProfileContentProps) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    specialties: doctor.specialties.join(', '),
    city: doctor.location.city,
    state: doctor.location.state,
    address: doctor.location.address || '',
    zipCode: doctor.location.zipCode || '',
    conditions: doctor.conditions.join(', '),
    bio: doctor.bio,
    brandColor: doctor.brandColor || '#3B82F6',
    phone: doctor.contact?.phone || '',
    email: doctor.contact?.email || '',
    website: doctor.contact?.website || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if current user is admin (only admins can edit/delete)
  const isAdmin = user?.role === 'admin';

  const handleEdit = () => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      specialties: doctor.specialties.join(', '),
      city: doctor.location.city,
      state: doctor.location.state,
      address: doctor.location.address || '',
      zipCode: doctor.location.zipCode || '',
      conditions: doctor.conditions.join(', '),
      bio: doctor.bio,
      brandColor: doctor.brandColor || '#3B82F6',
      phone: doctor.contact?.phone || '',
      email: doctor.contact?.email || '',
      website: doctor.contact?.website || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const doctorData = {
        name: formData.name,
        specialty: formData.specialty,
        specialties: formData.specialties
          ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
          : [formData.specialty],
        location: {
          city: formData.city,
          state: formData.state,
          address: formData.address || undefined,
          zipCode: formData.zipCode || undefined,
        },
        conditions: formData.conditions
          ? formData.conditions.split(',').map(c => c.trim()).filter(c => c)
          : [],
        bio: formData.bio,
        brandColor: formData.brandColor,
        contact: {
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          website: formData.website || undefined,
        },
      };

      const response = await fetch(`/api/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        setShowEditModal(false);
        router.refresh();
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update doctor');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/doctors/${doctor.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete doctor');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Back Link and Action Buttons */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={user ? "/dashboard" : "/"}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
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
          {user ? "Back to Directory" : "Back to Home"}
        </Link>
            
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <article className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
            {/* Doctor Header */}
            <header className="mb-6 pb-6 border-b border-gray-200">
              {/* Profile Image */}
              {doctor.image ? (
                <div className="relative w-full max-w-xs h-64 mb-6 rounded-lg overflow-hidden bg-gray-100 mx-auto md:mx-0 flex items-center justify-center">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-contain object-top"
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
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      {edu.year && (
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      )}
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
                      <p className="text-sm text-gray-600">
                        {cert.issuingOrganization}
                      </p>
                      {cert.year && (
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Contact Information */}
            {doctor.contact && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Contact
                </h2>
                <div className="space-y-2 text-gray-700">
                  {doctor.contact.phone && (
                    <p>
                      <span className="font-medium">Phone:</span>{' '}
                      <a
                        href={`tel:${doctor.contact.phone}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {doctor.contact.phone}
                      </a>
                    </p>
                  )}
                  {doctor.contact.email && (
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      <a
                        href={`mailto:${doctor.contact.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {doctor.contact.email}
                      </a>
                    </p>
                  )}
                  {doctor.contact.website && (
                    <p>
                      <span className="font-medium">Website:</span>{' '}
                      <a
                        href={doctor.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {doctor.contact.website}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Conditions Treated */}
            {doctor.conditions && doctor.conditions.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Conditions Treated
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.conditions.map((condition, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Doctor</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setError('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Doctor Name *
                      </label>
                      <input
                        id="edit-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-specialty" className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Specialty *
                      </label>
                      <input
                        id="edit-specialty"
                        type="text"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-specialties" className="block text-sm font-medium text-gray-700 mb-2">
                        All Specialties (comma-separated)
                      </label>
                      <input
                        id="edit-specialties"
                        type="text"
                        value={formData.specialties}
                        onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-brandColor" className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Color
                      </label>
                      <input
                        id="edit-brandColor"
                        type="color"
                        value={formData.brandColor}
                        onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        id="edit-city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-state" className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        id="edit-state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        id="edit-address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        id="edit-zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="edit-conditions" className="block text-sm font-medium text-gray-700 mb-2">
                        Conditions/Keywords (comma-separated)
                      </label>
                      <input
                        id="edit-conditions"
                        type="text"
                        value={formData.conditions}
                        onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        id="edit-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="edit-website" className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        id="edit-website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="edit-bio" className="block text-sm font-medium text-gray-700 mb-2">
                        Biography *
                      </label>
                      <textarea
                        id="edit-bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setError('');
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Doctor'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
  );

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorSchema) }}
      />

      {user ? (
        <AppLayout>
          {content}
        </AppLayout>
      ) : (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          {content}
        </div>
      )}
    </>
  );
}
