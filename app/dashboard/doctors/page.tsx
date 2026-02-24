'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import DoctorCard from '@/components/cards/DoctorCard';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import { getFilterOptions, ActiveFilters, resetFilters } from '@/lib/filters';
import { searchDoctors } from '@/lib/search';
import { filterDoctors } from '@/lib/filters';
import { Doctor } from '@/types/doctor';
import Link from 'next/link';

export default function DoctorsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(resetFilters());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchDoctors();
    }
  }, [user, token]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAllDoctors(allDoctors.filter(d => d.id !== id));
      } else {
        alert('Failed to delete doctor');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  const handleEdit = (doctor: Doctor) => {
    router.push(`/dashboard/doctors/${doctor.id}/edit`);
  };

  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="absolute inset-0 bg-[#F3EFFF] w-full surgery-radius-box "></div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-6 bg">
          <div className="">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#4A3E7F] mb-4 text-center mt-12"  >
                Before You Commit to Surgery, <br /> Get Expert Confirmation
              </h1>
              <p className="text-gray-600 text-lg text-center"> Search our network of board-certified orthopedic specialists who provide <br />
                independent second opinions across 110+ conditions.</p>
            </div>

          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-12">
            <div className="max-w-7xl mx-auto bg-white p-6 ">
              <p className="text-sm font-semibold text-gray-500 mb-4 flex items-center justify-center gap-2 flex-wrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Search by <span className="text-[#7C5CFC]">Diagnosis,</span> Not Just Name
              </p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder='Try "ACL reconstruction" or "Knee arthritis"'
                  className="flex-1 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C5CFC] text-black sm-w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="sm-w-full bg-[#8B6EED] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#7659D8] transition-colors">
                  Search
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-green-500">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  ACL reconstruction</span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-green-500">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Rotator cuff tear</span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-green-500">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Cardiology</span>
              </div>
            </div>


            {/* Filter Panel - Expandable */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <FilterPanel
                  filterOptions={filterOptions}
                  activeFilters={activeFilters}
                  onFilterChange={setActiveFilters}
                />
              </div>
            )}

            {/* Active Filters and Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold text-gray-900">{filteredDoctors.length}</span> {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
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
                            const newSpecialties = activeFilters.specialties.filter((s: string) => s !== specialty);
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
                            const newStates = activeFilters.states.filter((s: string) => s !== state);
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
                    setShowFilters(false);
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
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm font-medium text-gray-600 mb-8">
          <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-green-500">
            <path d="M20 6L9 17l-5-5" />
          </svg> Vetted Surgeons</span>
          <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-green-500">
            <path d="M20 6L9 17l-5-5" />
          </svg>Independent Reviews</span>
          <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-green-500">
            <path d="M20 6L9 17l-5-5" />
          </svg> No Referral Required</span>
        </div>
      </div>
      {/* Doctor Grid */}

      <div className='bg-[#f5f5f5]'>
        {allDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors yet</h3>
            <p className="text-gray-600 mb-6 text-sm">Get started by adding your first doctor profile</p>
            <Link
              href="/dashboard/doctors/add"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Doctor
            </Link>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-6 text-sm">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilters(resetFilters());
                setShowFilters(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>


        ) : (

          <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Sidebar */}
            <aside className={`md:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="sticky top-20">
                <FilterPanel
                  filterOptions={filterOptions}
                  activeFilters={activeFilters}
                  onFilterChange={setActiveFilters}
                />
              </div>
            </aside>


            {/* Main Content */}
            <div className="md:col-span-9 space-y-6">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                <p className="text-sm text-gray-500">Every surgeon carefully vetted by our advisory board • No referral required</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={true}
                  />
                ))}
              </div>

            </div>

          </div>
        )}

      </div>

    </AppLayout>
  );
}
