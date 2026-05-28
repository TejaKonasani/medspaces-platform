'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, MessageCircle, Building2, BadgeCheck, Clock, Car, Pill, Activity, Zap, Users, IndianRupee, ArrowLeft, Calendar, Armchair } from 'lucide-react';
import type { Listing } from '@/types';
import { api } from '@/lib/api-client';
import { Alert, Badge, Card, EmptyState, Skeleton, SkeletonGrid } from '@/components/ui';

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await api.listings.getById(String(params.id));
        if (data.success) {
          const nextListing = data.data ?? null;
          setListing(nextListing);
          setActiveImage(nextListing?.images[0] ?? null);
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
      <div className="section-padding min-h-screen py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="mt-3 h-4 w-72" />
              <Skeleton className="mt-6 h-72 w-full" />
            </Card>
            <SkeletonGrid count={2} />
          </div>
          <Card className="h-fit p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-4 h-10 w-full" />
            <Skeleton className="mt-3 h-10 w-full" />
            <Skeleton className="mt-3 h-10 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="section-padding py-20">
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title={error || 'Listing not found'}
          description="The listing may have been removed or the URL may be incorrect."
          action={<Link href="/browse" className="btn-primary">Back to browse</Link>}
        />
      </div>
    );
  }

  const facilityLabel: Record<string, string> = {
    clinic: 'Clinic', hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center', polyclinic: 'Polyclinic',
  };

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <div className="section-padding py-8">
        <Link href="/browse" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{listing.clinicName}</h1>
                    {listing.verified ? <BadgeCheck className="h-6 w-6 text-primary-600" /> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="info">{facilityLabel[listing.facilityType]}</Badge>
                    {listing.verified ? <Badge variant="success">Verified listing</Badge> : null}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{listing.address}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-72 bg-gradient-to-br from-primary-50 via-white to-secondary-50 sm:h-80">
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={`${listing.clinicName} preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-24 w-24 text-primary-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
              </div>
              {listing.images.length > 1 ? (
                <div className="grid grid-cols-3 gap-3 border-t border-gray-100 p-4 sm:grid-cols-4">
                  {listing.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all ${activeImage === image ? 'border-primary-400 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-200'}`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${listing.clinicName} gallery ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">Consultation room details</h2>
                <div className="mt-5 grid gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-gray-500">Rooms available</p>
                      <p className="font-semibold text-gray-900">{listing.rooms.available}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Armchair className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm text-gray-500">Room size</p>
                      <p className="font-semibold text-gray-900">{listing.rooms.size}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">Availability</h2>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>{listing.availability.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>{listing.availability.hours}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Furniture and equipment</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Furniture</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.rooms.furniture.length > 0 ? listing.rooms.furniture.map((item) => <Badge key={item} variant="neutral">{item}</Badge>) : <p className="text-sm text-gray-500">No furniture details provided.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Equipment</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.rooms.equipment.length > 0 ? listing.rooms.equipment.map((item) => <Badge key={item} variant="outline">{item}</Badge>) : <p className="text-sm text-gray-500">No equipment details provided.</p>}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Infrastructure</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Parking', available: listing.infrastructure.parking, icon: Car },
                  { label: 'Waiting Area', available: listing.infrastructure.waitingArea, icon: Users },
                  { label: 'Pharmacy', available: listing.infrastructure.pharmacy, icon: Pill },
                  { label: 'Diagnostics', available: listing.infrastructure.diagnostics, icon: Activity },
                  { label: 'Power Backup', available: listing.infrastructure.powerBackup, icon: Zap },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-2 rounded-2xl p-3 ${item.available ? 'bg-secondary-50 text-secondary-700' : 'bg-gray-50 text-gray-400'}`}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Preferred specialties</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.specialties.map((specialty) => <Badge key={specialty} variant="info">{specialty}</Badge>)}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-600">Monthly fee</span>
                  <span className="flex items-center text-2xl font-bold tracking-tight text-gray-900"><IndianRupee className="h-5 w-5" />{listing.pricing.monthlyFee.toLocaleString()}</span>
                </div>
                {listing.pricing.slotFee ? <div className="flex items-center justify-between gap-4 text-gray-700"><span>Per slot</span><span className="flex items-center font-semibold"><IndianRupee className="h-4 w-4" />{listing.pricing.slotFee.toLocaleString()}</span></div> : null}
                {listing.pricing.deposit ? <div className="flex items-center justify-between gap-4 text-gray-700"><span>Deposit</span><span className="flex items-center font-semibold"><IndianRupee className="h-4 w-4" />{listing.pricing.deposit.toLocaleString()}</span></div> : null}
              </div>

              <div className="mt-6 space-y-3">
                <a href={`tel:${listing.phone}`} className="w-full btn-primary flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" /> Call clinic
                </a>
                <a href={`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-full btn-secondary flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
                <Link href={`/inquiry?listing=${listing.id}`} className="btn-outline w-full text-center">
                  <Mail className="h-5 w-5" /> Request introduction
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Contact person</p>
                <p className="mt-1 font-semibold text-gray-900">{listing.contactPerson}</p>
                <p className="text-sm text-gray-600">{listing.email}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
