import Link from 'next/link';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function DoctorCard({ doctor, onEdit, onDelete, showActions = false }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden group">
      {doctor.brandColor && (
        <div
          className="h-1 w-full"
          style={{ backgroundColor: doctor.brandColor }}
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
            <p
              className="font-medium text-sm mb-2"
              style={{ color: doctor.brandColor || '#3B82F6' }}
            >
              {doctor.specialty}
            </p>
            <p className="text-gray-600 text-sm">
              {doctor.location.city}, {doctor.location.state}
            </p>
          </div>
        </div>

        {doctor.bio && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{doctor.bio}</p>
        )}

        {doctor.conditions && doctor.conditions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.conditions.slice(0, 3).map((condition, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/dashboard/doctors/${doctor.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {showActions && onEdit && onDelete && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(doctor)}
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(doctor.id)}
                className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
