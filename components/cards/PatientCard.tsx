import Link from 'next/link';
import { Patient } from '@/types/patient';

interface PatientCardProps {
  patient: Patient;
  onEdit?: (patient: Patient) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function PatientCard({ patient, onEdit, onDelete, showActions = false }: PatientCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{patient.name}</h3>
            {patient.dateOfBirth && (
              <p className="text-gray-600 text-sm mb-1">
                DOB: {formatDate(patient.dateOfBirth)}
              </p>
            )}
            {patient.gender && (
              <p className="text-gray-600 text-sm capitalize">{patient.gender}</p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {patient.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {patient.email}
            </div>
          )}
          {patient.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {patient.phone}
            </div>
          )}
          {patient.city && patient.state && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {patient.city}, {patient.state}
            </div>
          )}
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Allergies</p>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/dashboard/patients/${patient.id}`}
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
                onClick={() => onEdit(patient)}
                className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(patient.id)}
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
