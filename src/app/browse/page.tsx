'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { cities, specialties, facilityTypes } from '@/data/listings';
import type { Listing, PaginationMeta } from '@/types';

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCity) params.set('city', selectedCity);
    if (selectedSpecialty) params.set('specialty', selectedSpecialty);
    if (selectedFacilityType) params.set('facilityType', selectedFacilityType);
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    try {
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.data);
        setMeta(data.meta);
      } else {
        setError(data.error || 'Failed to fetch listings');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCity, selectedSpecialty, selectedFacilityType, priceRange]);

  useEffect(() => {
    const debounce = setTimeout(fetchListings, 300);
    return () => clearTimeout(debounce);
  }, [fetchListings]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedSpecialty('');
    setSelectedFacilityType('');
    setPriceRange('');
  };

  const facilityLabels: Record<string, string> = {
    clinic: 'Clinic',
    hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center',
    polyclinic: 'Polyclinic',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Consultation Spaces</h1>
          <p className="text-gray-600 mt-1">Discover available consultation rooms across India</p>
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by clinic name or locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 md:hidden"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                  Clear All
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility Type</label>
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    {facilityTypes.map((type) => (
                      <option key={type} value={type}>{facilityLabels[type]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Price</option>
                    <option value="0-20000">Under ₹20,000</option>
                    <option value="20000-35000">₹20,000 - ₹35,000</option>
                    <option value="35000-50000">₹35,000 - ₹50,000</option>
                    <option value="50000-100000">₹50,000+</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</span>
                ) : (
                  <><span className="font-semibold text-gray-900">{meta?.total ?? listings.length}</span> spaces found</>
                )}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
            )}

            {!loading && listings.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {!loading && listings.length === 0 && !error && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-gray-300 mx-auto" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No spaces found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find more results</p>
                <button onClick={clearFilters} className="mt-4 btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
