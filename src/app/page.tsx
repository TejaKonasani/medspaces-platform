import Link from 'next/link';
import { Search, Building2, UserCheck, ArrowRight, MapPin, Shield, Clock } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import { sampleListings } from '@/data/listings';

export default function Home() {
  const featuredListings = sampleListings.filter((l) => l.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="section-padding py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Perfect <br />
              <span className="text-primary-200">Consultation Space</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 max-w-2xl">
              India&apos;s largest marketplace for consultation spaces. Discover available OPD rooms across clinics, hospitals, and diagnostic centers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/browse" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-center">
                Browse Spaces
              </Link>
              <Link href="/add-space" className="btn-outline border-white text-white hover:bg-white/10 text-center">
                List Your Space
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="section-padding py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">100+</div>
              <div className="text-sm text-gray-500 mt-1">Listed Clinics</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-500 mt-1">Registered Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">6</div>
              <div className="text-sm text-gray-500 mt-1">Cities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">20+</div>
              <div className="text-sm text-gray-500 mt-1">Matches/Month</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="section-padding">
          <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
            Find and connect with available consultation spaces in three simple steps
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Search & Discover</h3>
              <p className="mt-2 text-gray-600">Browse available consultation rooms by city, specialty, and budget</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Explore Details</h3>
              <p className="mt-2 text-gray-600">View facility details, pricing, availability, and infrastructure</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <UserCheck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Connect & Start</h3>
              <p className="mt-2 text-gray-600">Contact clinics directly or request an introduction via MedSpaces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section>
        <div className="section-padding">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Featured Spaces</h2>
            <Link href="/browse" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Why MedSpaces */}
      <section className="bg-gray-50">
        <div className="section-padding">
          <h2 className="text-3xl font-bold text-center text-gray-900">Why Choose MedSpaces</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verified Listings</h3>
                <p className="text-gray-600 mt-1">Every listing is verified by our team for authenticity and quality</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Multiple Cities</h3>
                <p className="text-gray-600 mt-1">Find spaces across major Indian cities with local area filtering</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Flexible Options</h3>
                <p className="text-gray-600 mt-1">Monthly rentals, slot-based fees, and various practice models</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white">
        <div className="section-padding text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your Practice?</h2>
          <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
            Join hundreds of doctors who have found their ideal consultation space through MedSpaces
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/doctor" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Register as Doctor
            </Link>
            <Link href="/add-space" className="btn-outline border-white text-white hover:bg-white/10">
              List Your Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
