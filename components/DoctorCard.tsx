/**
 * DoctorCard Component
 * 
 * Enhanced doctor card with modern UI and better user experience.
 * 
 * Features:
 * - Beautiful card design with brand color accents
 * - Hover effects and animations
 * - Condition tags display
 * - Location with icon
 * - Specialty badge
 * - Responsive and accessible
 */

import Link from 'next/link';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Use brand color if provided, otherwise default to blue
  const accentColor = doctor.brandColor || '#3B82F6';
  const accentColorLight = doctor.brandColor ? `${accentColor}15` : '#EFF6FF';

  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-200 relative overflow-hidden transform hover:-translate-y-1"
      style={{
        borderColor: doctor.brandColor ? `${accentColor}30` : undefined,
      }}
      aria-label={`View profile for ${doctor.name}`}
    >
      {/* Brand Color Accent Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex flex-col h-full p-6">
        {/* Header Section */}
        <div className="mb-4">
          {/* Doctor Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {doctor.name}
          </h3>

          {/* Specialty Badge */}
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3"
            style={{
              backgroundColor: accentColorLight,
              color: accentColor,
            }}
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doctor.specialty}
          </div>
        </div>

        {/* Location Section */}
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">
            {doctor.location.city}, {doctor.location.state}
          </span>
        </div>

        {/* Conditions Tags (First 3) */}
        {doctor.conditions && doctor.conditions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {doctor.conditions.slice(0, 3).map((condition, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {condition}
              </span>
            ))}
            {doctor.conditions.length > 3 && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-500">
                +{doctor.conditions.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span
            className="text-sm font-semibold flex items-center group-hover:gap-2 transition-all"
            style={{ color: accentColor }}
          >
            View Profile
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accentColorLight }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: accentColor }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
