/**
 * Full GHL Embeddable Doctor Directory Page
 * 
 * Complete, professional doctor directory optimized for GoHighLevel iframe embedding.
 * 
 * Features:
 * - Full search functionality (name, specialty, condition)
 * - Advanced filtering (specialty, state)
 * - Beautiful doctor cards with images
 * - Complete doctor profiles
 * - Mobile responsive
 * - No external dependencies
 * - Optimized for iframe embedding
 * 
 * To embed in GoHighLevel:
 * Use iframe: <iframe src="https://your-domain.com/embed" width="100%" height="800" frameborder="0"></iframe>
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
  const [showFilters, setShowFilters] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors/public');
        if (response.ok) {
          const data = await response.json();
          setAllDoctors(data.doctors || []);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Find Your Doctor
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Search by name, specialty, or medical condition
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                  <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {activeFilters.specialties.length + activeFilters.states.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar in Header */}
          <div className="mt-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, specialty, or condition..."
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters (Desktop) */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24">
              <FilterPanel
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
            </div>
          </aside>

          {/* Right Content - Search and Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredDoctors.length === 0 ? (
                    <span className="text-gray-500">No doctors found</span>
                  ) : filteredDoctors.length === 1 ? (
                    <span className="text-blue-600">1 doctor found</span>
                  ) : (
                    <span className="text-blue-600">{filteredDoctors.length} doctors found</span>
                  )}
                </p>
                {allDoctors.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Showing {filteredDoctors.length} of {allDoctors.length} doctors
                  </p>
                )}
              </div>
              {(searchQuery || activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters(resetFilters());
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredDoctors.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find more results.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters(resetFilters());
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Doctor Grid */}
            {filteredDoctors.length > 0 && (
              <DoctorGrid doctors={filteredDoctors} embedMode={true} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowFilters(false)}
        >
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
