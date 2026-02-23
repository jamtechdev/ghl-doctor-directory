'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function DoctorCard({ doctor, onEdit, onDelete, showActions = false }: DoctorCardProps) {
  const [imageError, setImageError] = useState(false);

  // Generate initials for dummy image
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group flex flex-col h-full">
      {/* Brand Color Accent */}
      {doctor.brandColor && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: doctor.brandColor }}
        />
      )}
      
      {/* Image Section - Fixed Height */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {doctor.image && !imageError ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-full h-full object-contain object-top group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg relative"
              style={{ 
                background: doctor.brandColor 
                  ? `linear-gradient(135deg, ${doctor.brandColor} 0%, ${doctor.brandColor}dd 100%)`
                  : 'linear-gradient(135deg, #673AB7 0%, #7B1FA2 100%)'
              }}
            >
              <span className="relative z-10">{getInitials(doctor.name)}</span>
              <div className="absolute inset-0 rounded-full opacity-20" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
              }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Name and Specialty */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-1">{doctor.name}</h3>
          <p
            className="font-semibold text-sm mb-1.5"
            style={{ color: doctor.brandColor || '#3B82F6' }}
          >
            {doctor.specialty}
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {doctor.location.city}, {doctor.location.state}
          </p>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="text-gray-600 text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">{doctor.bio}</p>
        )}

        {/* Conditions Tags */}
        {doctor.conditions && doctor.conditions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {doctor.conditions.slice(0, 3).map((condition, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-200"
              >
                {condition}
              </span>
            ))}
            {doctor.conditions.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md border border-gray-200">
                +{doctor.conditions.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto gap-2">
          <Link
            href={`/dashboard/doctors/${doctor.id}`}
            className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            View
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {showActions && onEdit && onDelete && (
            <div className="flex gap-1.5">
              <button
                onClick={() => onEdit(doctor)}
                className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-xs font-medium"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(doctor.id)}
                className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors text-xs font-medium"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
