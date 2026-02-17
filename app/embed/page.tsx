/**
 * Embeddable Doctor Directory Page for GoHighLevel
 * 
 * This is a standalone, embeddable version of the directory designed for iframe embedding.
 * 
 * Features:
 * - No external dependencies on parent page
 * - Optimized for iframe embedding
 * - Same functionality as main directory
 * - Clean, isolated styling
 * 
 * To embed in GoHighLevel:
 * 1. Build the Next.js app: npm run build
 * 2. Deploy to hosting (Vercel, Netlify, etc.)
 * 3. Use Custom HTML block in GHL with iframe:
 *    <iframe src="https://your-domain.com/embed" width="100%" height="800" frameborder="0"></iframe>
 * 
 * Or use the direct URL in GHL's iframe widget.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { getFilterOptions, ActiveFilters, resetFilters } from '@/lib/filters';
import { searchDoctors } from '@/lib/search';
import { filterDoctors } from '@/lib/filters';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DoctorGrid from '@/components/DoctorGrid';
import { Doctor } from '@/types/doctor';

export default function EmbedDirectoryPage() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from API
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors/public');
        if (response.ok) {
          const data = await response.json();
          setAllDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for active filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(resetFilters());

  // Get available filter options from all doctors
  const filterOptions = useMemo(() => getFilterOptions(allDoctors), [allDoctors]);

  // Apply search and filters
  const filteredDoctors = useMemo(() => {
    // First apply search
    let results = searchDoctors(allDoctors, searchQuery);

    // Then apply filters
    results = filterDoctors(results, activeFilters);

    return results;
  }, [allDoctors, searchQuery, activeFilters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ minHeight: '100vh' }}>
      {/* Compact Header for Embed */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Find a Doctor
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Search by name, specialty, or condition
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <FilterPanel
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
          </aside>

          {/* Right Content - Search and Results */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, specialty, or condition..."
              />
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredDoctors.length === 1
                  ? '1 doctor found'
                  : `${filteredDoctors.length} doctors found`}
              </p>
              {(searchQuery || activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters(resetFilters());
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Doctor Grid */}
            <DoctorGrid doctors={filteredDoctors} />
          </div>
        </div>
      </main>
    </div>
  );
}
