/**
 * Enhanced FilterPanel Component
 * 
 * Modern filter panel with improved UX and visual design.
 * 
 * Features:
 * - Collapsible on mobile
 * - Multi-select checkboxes
 * - Active filter badges
 * - Clear filters button
 * - Search within filters
 * - Better visual hierarchy
 */

'use client';

import { useState, useEffect } from 'react';
import { ActiveFilters, FilterOptions, hasActiveFilters, resetFilters } from '@/lib/filters';

interface FilterPanelProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
}

export default function FilterPanel({
  filterOptions,
  activeFilters,
  onFilterChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSpecialtyToggle = (specialty: string) => {
    const newSpecialties = activeFilters.specialties.includes(specialty)
      ? activeFilters.specialties.filter(s => s !== specialty)
      : [...activeFilters.specialties, specialty];

    onFilterChange({
      ...activeFilters,
      specialties: newSpecialties,
    });
  };

  const handleStateToggle = (state: string) => {
    const newStates = activeFilters.states.includes(state)
      ? activeFilters.states.filter(s => s !== state)
      : [...activeFilters.states, state];

    onFilterChange({
      ...activeFilters,
      states: newStates,
    });
  };

  const handleClearFilters = () => {
    onFilterChange(resetFilters());
    setSpecialtySearch('');
    setStateSearch('');
  };

  const shouldShowContent = !isMobile || isOpen;

  // Filter options based on search
  const filteredSpecialties = filterOptions.specialties.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  const filteredStates = filterOptions.states.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Mobile Header - Collapsible */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
          aria-expanded={isOpen}
          aria-controls="filter-content"
        >
          <svg
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Filters</h2>
        <p className="text-xs text-gray-600">Refine your search</p>
      </div>

      {/* Filter Content */}
      <div
        id="filter-content"
        className={shouldShowContent ? 'block' : 'hidden'}
      >
        <div className="p-4 space-y-6">
          {/* Specialty Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Specialty
              </h3>
              {activeFilters.specialties.length > 0 && (
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {activeFilters.specialties.length}
                </span>
              )}
            </div>
            
            {/* Specialty Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                placeholder="Search specialties..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredSpecialties.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">No specialties found</p>
              ) : (
                filteredSpecialties.map(specialty => (
                  <label
                    key={specialty}
                    className="flex items-center cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      aria-label={`Filter by ${specialty}`}
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                      {specialty}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center">
                <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                State
              </h3>
              {activeFilters.states.length > 0 && (
                <span className="text-xs font-medium text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  {activeFilters.states.length}
                </span>
              )}
            </div>

            {/* State Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search states..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredStates.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">No states found</p>
              ) : (
                filteredStates.map(state => (
                  <label
                    key={state}
                    className="flex items-center cursor-pointer hover:bg-teal-50 p-2 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.states.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                      aria-label={`Filter by ${state}`}
                    />
                    <span className="ml-3 text-sm text-gray-700 group-hover:text-teal-600 transition-colors">
                      {state}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters(activeFilters) && (
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
