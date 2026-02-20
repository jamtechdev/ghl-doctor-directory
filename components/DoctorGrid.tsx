/**
 * DoctorGrid Component
 * 
 * Displays doctors in a responsive grid layout.
 * 
 * Features:
 * - Responsive grid: 1 column (mobile), 2-3 columns (tablet), 3-4 columns (desktop)
 * - Empty state when no doctors match search/filters
 * - Loading states (if needed in future)
 * - Accessible grid structure
 */

import { Doctor } from '@/types/doctor';
import DoctorCard from './DoctorCard';

interface DoctorGridProps {
  doctors: Doctor[];
  embedMode?: boolean;
}

export default function DoctorGrid({ doctors }: DoctorGridProps) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No doctors found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters to find more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} embedMode={embedMode} />
      ))}
    </div>
  );
}
