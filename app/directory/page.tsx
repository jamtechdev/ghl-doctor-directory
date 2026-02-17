/**
 * Doctor Directory Page
 * 
 * Main directory page with search, filters, and doctor grid.
 * 
 * Features:
 * - Real-time search (name, specialty, conditions)
 * - Multi-select filters (Specialty, State)
 * - Brand-color-coded doctor cards
 * - Mobile-responsive with collapsible filters
 * - SEO-optimized with Organization schema
 * - Fast performance with client-side filtering
 * 
 * This page is designed to be embeddable in GoHighLevel via iframe.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { getFilterOptions, ActiveFilters, resetFilters } from '@/lib/filters';
import { searchDoctors } from '@/lib/search';
import { filterDoctors } from '@/lib/filters';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DoctorGrid from '@/components/DoctorGrid';
import AppLayout from '@/components/AppLayout';
import { Doctor } from '@/types/doctor';

export default function DirectoryPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find a Doctor
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Search by name, specialty, or condition to find the right doctor for your needs
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
              {/* Search Bar - Always Visible */}
              <div className="mb-6">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by doctor name, specialty, or condition (e.g., ACL reconstruction, rotator cuff)"
                />
              </div>

              {/* Results Count and Active Filters */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-700">
                    {filteredDoctors.length === 1
                      ? '1 doctor found'
                      : `${filteredDoctors.length} doctors found`}
                  </p>
                  {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                          <button
                            onClick={() => {
                              const newSpecialties = activeFilters.specialties.filter(s => s !== specialty);
                              setActiveFilters({ ...activeFilters, specialties: newSpecialties });
                            }}
                            className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      {activeFilters.states.map(state => (
                        <span
                          key={state}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                        >
                          {state}
                          <button
                            onClick={() => {
                              const newStates = activeFilters.states.filter(s => s !== state);
                              setActiveFilters({ ...activeFilters, states: newStates });
                            }}
                            className="ml-2 hover:bg-teal-200 rounded-full p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {(searchQuery || activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilters(resetFilters());
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all
                  </button>
                )}
              </div>

              {/* Doctor Grid */}
              <DoctorGrid doctors={filteredDoctors} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
