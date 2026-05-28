'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Building2, UserCheck, ArrowRight, MapPin, Shield, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { api } from '@/lib/api-client';
import { Badge, Button, Card, EmptyState, LoadingSpinner, SkeletonGrid } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Listing } from '@/types';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [stats, setStats] = useState({
    listedClinics: 0,
    registeredDoctors: 0,
    cities: 0,
    matchesPerMonth: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function loadHomeData() {
      try {
        const [listingsRes, doctorsRes] = await Promise.all([
          api.listings.getAll({ limit: 100 }),
          api.doctors.getAll(),
        ]);

        if (!mounted) return;

        const listings = listingsRes.success ? (listingsRes.data ?? []) : [];
        const doctors = doctorsRes.success ? (doctorsRes.data ?? []) : [];

        setFeaturedListings(listings.filter((listing) => listing.featured));
        setStats({
          listedClinics: listings.length,
          registeredDoctors: doctors.length,
          cities: new Set(listings.map((listing) => listing.city)).size,
          matchesPerMonth: listings.filter((listing) => listing.verified).length,
        });
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    }

    loadHomeData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_26%)]" />
        <div className="section-padding relative grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              SaaS-grade consultation marketplace
            </Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Find the right consultation space for every specialty.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-100 md:text-xl">
              Discover verified OPD rooms, compare availability and pricing, and connect with clinics through a polished process designed for modern medical teams.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login?redirect=/browse" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-center">
                Sign in to browse
              </Link>
              <Link href="/register" className="btn-outline border-white bg-transparent text-white hover:bg-white/10 text-center">
                Register
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-primary-100">
              {['Verified listings', 'Responsive UI', 'RBAC protected admin flow'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Card className="!border-white/15 !bg-slate-950/35 text-white shadow-2xl shadow-slate-950/30 backdrop-blur-2xl">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {[
                { label: 'Listed clinics', value: `${stats.listedClinics}+` },
                { label: 'Doctors onboarded', value: `${stats.registeredDoctors}+` },
                { label: 'Cities covered', value: `${stats.cities}` },
                { label: 'Verified listings', value: `${stats.matchesPerMonth}+` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/8 p-4 shadow-inner shadow-white/5">
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 px-6 py-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">Built for scale</p>
              <div className="mt-3 grid gap-3 text-sm text-white/90">
                {[
                  'API-driven listings and inquiry flows',
                  'Role-aware admin dashboard',
                  'Progressive loading and error states',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/8 px-3 py-3">
                    <CheckCircle2 className="h-4 w-4 text-secondary-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white/80">
        <div className="section-padding py-8">
          <div className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Listed clinics', value: stats.listedClinics, helper: 'Verified and searchable' },
              { label: 'Registered doctors', value: stats.registeredDoctors, helper: 'Growing professional network' },
              { label: 'Cities covered', value: stats.cities, helper: 'National marketplace footprint' },
              { label: 'Verified listings', value: stats.matchesPerMonth, helper: 'Reviewed for trust and quality' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-3xl font-bold tracking-tight text-primary-700">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{stat.label}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50/80">
        <div className="section-padding">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">Process</p>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">How it works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
            Find and connect with available consultation spaces in three simple steps
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card>
              <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Search & discover</h3>
                <p className="mt-2 text-gray-600">Browse spaces by city, specialty, budget, and facility type.</p>
              </div>
            </Card>
            <Card>
              <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Explore details</h3>
                <p className="mt-2 text-gray-600">View pricing, availability, infrastructure, and verified profiles.</p>
              </div>
            </Card>
            <Card>
              <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <UserCheck className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Connect & start</h3>
                <p className="mt-2 text-gray-600">Request introductions or reach out directly to the clinic.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <div className="section-padding">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">Featured</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Featured spaces</h2>
            </div>
            <Link href="/login?redirect=/browse" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800">
              Sign in to browse <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="mt-8">
              <LoadingSpinner label="Loading featured spaces" />
              <div className="mt-6">
                <SkeletonGrid count={3} />
              </div>
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.slice(0, 3).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="No featured listings available right now"
                description="Once clinics publish highlighted spaces, they will appear here automatically."
                icon={<Building2 className="h-6 w-6" />}
                action={<Link href="/login?redirect=/browse" className="btn-primary">Sign in to browse</Link>}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50/80">
        <div className="section-padding">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Why choose MedSpaces</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Verified listings', desc: 'Every listing is reviewed so clinics and doctors can move faster with confidence.', color: 'primary' },
              { icon: MapPin, title: 'Multiple cities', desc: 'Find spaces across major Indian cities with local area filtering.', color: 'secondary' },
              { icon: Clock, title: 'Flexible options', desc: 'Monthly rentals, slot-based fees, and practice models that fit real schedules.', color: 'primary' },
            ].map((item) => (
              <Card key={item.title}>
                <div className="flex h-full items-start gap-4 p-6">
                  <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', item.color === 'primary' ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600')}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-700 text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to start your practice?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Joined hundreds of doctors who have found their ideal consultation space through MedSpaces
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register?role=DOCTOR" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Register as Doctor
            </Link>
            <Link href="/register?role=CLINIC_OWNER" className="btn-outline border-white bg-transparent text-white hover:bg-white/10">
              Register as Clinic
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
