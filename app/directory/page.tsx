'use client';

import { useState, useMemo, useEffect } from 'react';
import { getFilterOptions, ActiveFilters, resetFilters } from '@/lib/filters';
import { searchDoctors } from '@/lib/search';
import { filterDoctors } from '@/lib/filters';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DoctorGrid from '@/components/DoctorGrid';
import { Doctor } from '@/types/doctor';
import PublicLayout from '@/components/PublicLayout';

export default function DirectoryPage() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(resetFilters());

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

  const filterOptions = useMemo(() => getFilterOptions(allDoctors), [allDoctors]);

  const filteredDoctors = useMemo(() => {
    let results = searchDoctors(allDoctors, searchQuery);
    results = filterDoctors(results, activeFilters);
    return results;
  }, [allDoctors, searchQuery, activeFilters]);

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Doctor Directory
            </h1>
            <p className="text-gray-600 text-lg text-center max-w-3xl mx-auto">
              Search our network of board-certified orthopedic specialists who provide independent second opinions across 110+ conditions.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder='Try "ACL reconstruction" or "Knee arthritis"'
                  className="flex-1 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all">
                  Search
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Vetted Surgeons
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Independent Reviews
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No Referral Required
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar - Filters */}
            <aside className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel
                  filterOptions={filterOptions}
                  activeFilters={activeFilters}
                  onFilterChange={setActiveFilters}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {filteredDoctors.length === 0 ? (
                        <span className="text-gray-500">No doctors found</span>
                      ) : filteredDoctors.length === 1 ? (
                        <span>1 doctor found</span>
                      ) : (
                        <span>{filteredDoctors.length} doctors found</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {(activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.specialties.map(specialty => (
                          <span key={specialty} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {specialty}
                            <button onClick={() => {
                              const newSpecialties = activeFilters.specialties.filter(s => s !== specialty);
                              setActiveFilters({ ...activeFilters, specialties: newSpecialties });
                            }} className="ml-2 hover:bg-purple-200 rounded-full p-0.5">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {activeFilters.states.map(state => (
                          <span key={state} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {state}
                            <button onClick={() => {
                              const newStates = activeFilters.states.filter(s => s !== state);
                              setActiveFilters({ ...activeFilters, states: newStates });
                            }} className="ml-2 hover:bg-blue-200 rounded-full p-0.5">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {(searchQuery || activeFilters.specialties.length > 0 || activeFilters.states.length > 0) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilters(resetFilters());
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveFilters(resetFilters());
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <DoctorGrid doctors={filteredDoctors} embedMode={false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
