'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, Building2, BadgeCheck, Clock, Car, Pill, Activity, Zap, Users, IndianRupee, ArrowLeft, Calendar, Armchair, Loader2 } from 'lucide-react';
import type { Listing } from '@/types';

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setListing(data.data);
        } else {
          setError(data.error || 'Listing not found');
        }
      } catch {
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="section-padding text-center py-20">
        <h1 className="text-2xl font-bold">{error || 'Listing not found'}</h1>
        <Link href="/browse" className="mt-4 btn-primary inline-block">Back to Browse</Link>
      </div>
    );
  }

  const facilityLabel: Record<string, string> = {
    clinic: 'Clinic', hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center', polyclinic: 'Polyclinic',
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/browse" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{listing.clinicName}</h1>
                    {listing.verified && <BadgeCheck className="h-6 w-6 text-primary-600" />}
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium">
                    {facilityLabel[listing.facilityType]}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 mt-3">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                {listing.address}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <Building2 className="h-24 w-24 text-primary-300" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Consultation Room Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rooms Available</p>
                    <p className="font-semibold">{listing.rooms.available}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Armchair className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Size</p>
                    <p className="font-semibold">{listing.rooms.size}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Furniture</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.rooms.furniture.map((item) => (
                    <span key={item} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.rooms.equipment.map((item) => (
                    <span key={item} className="px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{listing.availability.days.join(', ')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{listing.availability.hours}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Infrastructure</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Parking', available: listing.infrastructure.parking, icon: Car },
                  { label: 'Waiting Area', available: listing.infrastructure.waitingArea, icon: Users },
                  { label: 'Pharmacy', available: listing.infrastructure.pharmacy, icon: Pill },
                  { label: 'Diagnostics', available: listing.infrastructure.diagnostics, icon: Activity },
                  { label: 'Power Backup', available: listing.infrastructure.powerBackup, icon: Zap },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-2 p-3 rounded-lg ${item.available ? 'bg-secondary-50 text-secondary-700' : 'bg-gray-50 text-gray-400'}`}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Preferred Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {listing.specialties.map((s) => (
                  <span key={s} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium text-sm">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Fee</span>
                  <span className="flex items-center font-bold text-xl text-gray-900">
                    <IndianRupee className="h-5 w-5" />{listing.pricing.monthlyFee.toLocaleString()}
                  </span>
                </div>
                {listing.pricing.slotFee && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Per Slot</span>
                    <span className="flex items-center font-semibold text-gray-700">
                      <IndianRupee className="h-4 w-4" />{listing.pricing.slotFee.toLocaleString()}
                    </span>
                  </div>
                )}
                {listing.pricing.deposit && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span className="flex items-center font-semibold text-gray-700">
                      <IndianRupee className="h-4 w-4" />{listing.pricing.deposit.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <a href={`tel:${listing.phone}`} className="w-full btn-primary flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" /> Call Clinic
                </a>
                <a href={`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="w-full btn-secondary flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
                <Link href={`/inquiry?listing=${listing.id}`} className="w-full btn-outline flex items-center justify-center gap-2">
                  <Mail className="h-5 w-5" /> Request Introduction
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-semibold text-gray-900">{listing.contactPerson}</p>
                <p className="text-sm text-gray-600">{listing.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
