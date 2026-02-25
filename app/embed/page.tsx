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
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function EmbedDirectoryPage() {
  const { user, token } = useAuth();
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true); // Show filters by default for better experience

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

  // Handle suggestion tag clicks
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: '100vh', isolation: 'isolate' }}>
        {/* Header Skeleton */}
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Search Section Skeleton */}
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="h-4 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-full w-36 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: '100vh', isolation: 'isolate' }}>
      {/* Enhanced Header - Optimized for GHL */}
      <header className="bg-white   border-gray-200 sticky top-0 z-50" style={{ position: 'sticky', top: 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">


              <h1 className="text-4xl md:text-5xl font-bold text-[#4A3E7F] mb-4 text-center mt-12"  >
                Search by Diagnosis, not Just by Name
              </h1>


              <p className="text-gray-600 text-lg text-center"> Search our network of board-certified orthopedic specialists</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Add New Doctor Button - Admin Only */}
              {user?.role === 'admin' && (
                <Link
                  href="/dashboard/doctors/add"
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </Link>
              )}
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-3 sm:px-4 py-2 bg-[#3a2f68] text-white rounded-lg hover:bg-[#4a3f78] transition-colors font-medium flex items-center gap-2 text-sm"
                aria-label="Toggle filters"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                  <span className="bg-white text-[#3a2f68] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {activeFilters.specialties.length + activeFilters.states.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Separated Search Bar Section */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Label above search */}
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Q Search by Diagnosis, Not Just Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder='Try "ACL reconstruction" or "Knee arthritis"'
                className="flex-1 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-[#8B6EED] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#7659D8] transition-colors">
                Search
              </button>
            </div>
            {/* Search Bar */}


            {/* Suggestion Tags */}
            <div className="flex flex-wrap gap-2 mb-4 mt-4 justify-center items-center">
              {['ACL reconstruction', 'Rotator cuff tear', 'Cardiology'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Vetted Surgeons</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">Independent Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700">No Referral Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Optimized Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Sidebar - Filters (Desktop) - Enhanced for Best Experience */}
          <aside className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-20 sm:top-24 space-y-4">
              {/* Filter Header with Active Count */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Refine Your Search
                  </h2>
                  {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                    <span className="bg-white text-purple-600 rounded-full px-3 py-1 text-sm font-bold">
                      {activeFilters.specialties.length + activeFilters.states.length} active
                    </span>
                  )}
                </div>
                <p className="text-sm text-purple-100 mt-1">Find the perfect doctor for your needs</p>
              </div>
              <FilterPanel
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
            </div>
          </aside>

          {/* Right Content - Search and Results */}
          <div className="lg:col-span-9 min-w-0">
            
            {/* Results Header - Enhanced */}
            <div className="mb-4 sm:mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {filteredDoctors.length === 0 ? (
                          <span className="text-gray-500">No doctors found</span>
                        ) : filteredDoctors.length === 1 ? (
                          <span className="text-[#3a2f68]">1 doctor found</span>
                        ) : (
                          <span className="text-[#3a2f68]">{filteredDoctors.length} doctors found</span>
                        )}
                      </p>
                      {allDoctors.length > 0 && filteredDoctors.length !== allDoctors.length && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Showing {filteredDoctors.length} of {allDoctors.length} doctors
                        </p>
                      )}
                    </div>
                    {/* Active Filter Badges */}
                    {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.specialties.map(specialty => (
                          <span
                            key={specialty}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                            <button
                              onClick={() => {
                                const newSpecialties = activeFilters.specialties.filter(s => s !== specialty);
                                setActiveFilters({ ...activeFilters, specialties: newSpecialties });
                              }}
                              className="ml-1.5 hover:bg-blue-200 rounded-full p-0.5"
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
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                          >
                            {state}
                            <button
                              onClick={() => {
                                const newStates = activeFilters.states.filter(s => s !== state);
                                setActiveFilters({ ...activeFilters, states: newStates });
                              }}
                              className="ml-1.5 hover:bg-teal-200 rounded-full p-0.5"
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
                </div>

                {(searchQuery || activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilters(resetFilters());
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Empty State - Optimized */}
            {filteredDoctors.length === 0 && allDoctors.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find more results.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters(resetFilters());
                  }}
                  className="px-5 sm:px-6 py-2 bg-[#3a2f68] text-white rounded-lg hover:bg-[#4a3f78] transition-colors font-medium text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* No Doctors at All State */}
            {allDoctors.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 0 014 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No doctors available</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  The doctor directory is currently being updated. Please check back soon.
                </p>
              </div>
            )}

            {/* Doctor Grid */}
            {filteredDoctors.length > 0 && (
              <DoctorGrid doctors={filteredDoctors} embedMode={true} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Overlay - Optimized */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowFilters(false)}
          style={{ position: 'fixed', zIndex: 50 }}
        >
          <div
            className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '100vh' }}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white z-10 shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h2 className="text-lg font-bold">Refine Your Search</h2>
                {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                  <span className="bg-white text-purple-600 rounded-full px-2 py-0.5 text-xs font-bold">
                    {activeFilters.specialties.length + activeFilters.states.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
