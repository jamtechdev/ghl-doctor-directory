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
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');

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


  // Filter options based on search
  const filteredSpecialties = filterOptions.specialties.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  const filteredStates = filterOptions.states.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-900">Refine Results</h2>
      </div>

      {/* Filter Content */}
      <div className="p-4 space-y-5">
          {/* Specialty Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Specialty</h3>
              {activeFilters.specialties.length > 0 && (
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {activeFilters.specialties.length}
                </span>
              )}
            </div>
            
            {/* Specialty Search */}
            <div className="relative mb-2">
              <input
                type="text"
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <svg className="absolute left-2 top-1.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredSpecialties.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">No specialties found</p>
              ) : (
                filteredSpecialties.map(specialty => (
                  <label
                    key={specialty}
                    className="flex items-center cursor-pointer hover:bg-blue-50 p-1.5 rounded transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      aria-label={`Filter by ${specialty}`}
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-blue-600 transition-colors">
                      {specialty}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">State</h3>
              {activeFilters.states.length > 0 && (
                <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  {activeFilters.states.length}
                </span>
              )}
            </div>

            {/* State Search */}
            <div className="relative mb-2">
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
              <svg className="absolute left-2 top-1.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredStates.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">No states found</p>
              ) : (
                filteredStates.map(state => (
                  <label
                    key={state}
                    className="flex items-center cursor-pointer hover:bg-teal-50 p-1.5 rounded transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.states.includes(state)}
                      onChange={() => handleStateToggle(state)}
                      className="h-3.5 w-3.5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                      aria-label={`Filter by ${state}`}
                    />
                    <span className="ml-2 text-xs text-gray-700 group-hover:text-teal-600 transition-colors">
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
              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
    </div>
  );
}
