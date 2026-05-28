'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, FilterX, MapPin, Sparkles } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { api } from '@/lib/api-client';
import { cities, specialties, facilityTypes } from '@/data/listing-options';
import type { Listing, PaginationMeta } from '@/types';
import { Alert, Badge, Button, Card, EmptyState, Input, LoadingSpinner, Select, SkeletonGrid } from '@/components/ui';

const priceOptions = [
  { label: 'Any price', value: '' },
  { label: 'Under Rs 20,000', value: '0-20000' },
  { label: 'Rs 20,000 - Rs 35,000', value: '20000-35000' },
  { label: 'Rs 35,000 - Rs 50,000', value: '35000-50000' },
  { label: 'Rs 50,000+', value: '50000-100000' },
];

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const deferredSearch = useDeferredValue(searchTerm);
  const deferredCity = useDeferredValue(selectedCity);
  const deferredSpecialty = useDeferredValue(selectedSpecialty);
  const deferredFacilityType = useDeferredValue(selectedFacilityType);
  const deferredPriceRange = useDeferredValue(priceRange);

  const facilityLabels: Record<string, string> = {
    clinic: 'Clinic',
    hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center',
    polyclinic: 'Polyclinic',
  };

  const activeFilterCount = useMemo(() => {
    return [searchTerm, selectedCity, selectedSpecialty, selectedFacilityType, priceRange].filter(Boolean).length;
  }, [priceRange, searchTerm, selectedCity, selectedFacilityType, selectedSpecialty]);

  const fetchListings = useCallback(async (pageArg = 1) => {
    setLoading(true);
    setError('');

    const [minPrice, maxPrice] = deferredPriceRange ? deferredPriceRange.split('-') : [];

    try {
      const data = await api.listings.getAll({
        search: deferredSearch || undefined,
        city: deferredCity || undefined,
        specialty: deferredSpecialty || undefined,
        facilityType: (deferredFacilityType as Listing['facilityType']) || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page: pageArg,
      });

      if (data.success) {
        setListings(data.data ?? []);
        setMeta(data.meta ?? null);
        setPage(data.meta?.page ?? pageArg);
      } else {
        setError(data.error || 'Failed to fetch listings');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [deferredCity, deferredFacilityType, deferredPriceRange, deferredSearch, deferredSpecialty]);

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      // reset to first page when filters/search change
      void fetchListings(1);
    }, 250);

    return () => window.clearTimeout(debounce);
  }, [fetchListings, deferredSearch, deferredCity, deferredSpecialty, deferredFacilityType, deferredPriceRange]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedSpecialty('');
    setSelectedFacilityType('');
    setPriceRange('');
  }, []);

  const summaryText = useMemo(() => {
    if (loading) {
      return null;
    }

    const total = meta?.total ?? listings.length;
    return `${total} ${total === 1 ? 'space' : 'spaces'} found`;
  }, [listings.length, loading, meta?.total]);

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="section-padding py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge variant="info">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Marketplace
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Browse consultation spaces</h1>
              <p className="mt-3 text-balance text-gray-600">
                Discover premium consultation rooms across India with fast filters, verified clinics, and a streamlined search experience.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="min-w-[180px] p-4">
                <p className="text-sm text-gray-500">Coverage</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{cities.length} cities</p>
              </Card>
              <Card className="min-w-[180px] p-4">
                <p className="text-sm text-gray-500">Filter set</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{activeFilterCount}</p>
                <p className="text-xs text-gray-500">Active refinements</p>
              </Card>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
            <Input
              type="text"
              placeholder="Search by clinic name, locality, city, or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              aria-label="Search listings"
            />
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters((current) => !current)}
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              aria-expanded={showFilters}
              aria-controls="browse-filters"
            >
              Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </Button>
            <Button variant="ghost" onClick={clearFilters} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Reset filters
            </Button>
          </div>
        </div>
      </section>

      <div className="section-padding py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside id="browse-filters" className={`lg:block lg:w-80 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
            <Card className="sticky top-24 overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <p className="text-sm text-gray-500">Refine results without leaving the page.</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<FilterX className="h-4 w-4" />}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <Select label="City" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  <option value="">All cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                <Select label="Specialty" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                  <option value="">All specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </Select>
                <Select label="Facility type" value={selectedFacilityType} onChange={(e) => setSelectedFacilityType(e.target.value)}>
                  <option value="">All types</option>
                  {facilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {facilityLabels[type]}
                    </option>
                  ))}
                </Select>
                <Select label="Price range" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                  {priceOptions.map((option) => (
                    <option key={option.value || 'any'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </Card>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="surface flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Live search</p>
                  <div className="text-base font-semibold text-gray-900">
                    {loading ? <LoadingSpinner label="Refreshing listings" /> : summaryText}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {meta ? <Badge variant="outline">Page {meta.page} of {meta.totalPages}</Badge> : null}
                {activeFilterCount > 0 ? <Badge variant="info">{activeFilterCount} active filters</Badge> : <Badge variant="neutral">All listings</Badge>}
              </div>
            </div>

            {error ? (
              <Alert
                variant="error"
                title="We could not load listings"
                action={
                    <Button variant="outline" size="sm" onClick={() => void fetchListings(page)}>
                      Retry
                    </Button>
                  }
              >
                {error}
              </Alert>
            ) : null}

            {loading ? (
              <SkeletonGrid count={6} />
            ) : listings.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!meta) return;
                      const prev = Math.max(1, (meta.page ?? page) - 1);
                      void fetchListings(prev);
                    }}
                    disabled={!meta || (meta.page ?? page) <= 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>

                  <div className="text-sm text-gray-600">Page {meta?.page ?? page} of {meta?.totalPages ?? 1}</div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!meta) return;
                      const next = Math.min((meta.totalPages ?? page + 1), (meta.page ?? page) + 1);
                      void fetchListings(next);
                    }}
                    disabled={!meta || (meta.page ?? page) >= (meta?.totalPages ?? 1)}
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title="No spaces match these filters"
                description="Broaden the search terms or clear some filters to reveal more clinics and consultation rooms."
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
