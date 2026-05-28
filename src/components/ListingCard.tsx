import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, BadgeCheck, IndianRupee, ArrowRight } from 'lucide-react';
import type { Listing } from '@/types';
import { Badge, Card } from '@/components/ui';

function ListingCardComponent({ listing }: { listing: Listing }) {
  const facilityLabel = {
    clinic: 'Clinic',
    hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center',
    polyclinic: 'Polyclinic',
  };

  return (
    <Link href={`/listing/${listing.id}`} aria-label={`View details for ${listing.clinicName}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-slate-900/10">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={`${listing.clinicName} consultation space`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-900/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_52%)]" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="outline" className="bg-white/90 backdrop-blur">
              {facilityLabel[listing.facilityType]}
            </Badge>
            {listing.verified ? <Badge variant="success">Verified</Badge> : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/60 to-transparent" />
          {!listing.images[0] ? (
            <div className="flex h-full items-center justify-center text-primary-300 transition-transform duration-300 group-hover:scale-105">
              <Building2 className="h-16 w-16" />
            </div>
          ) : null}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{listing.clinicName}</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
              </div>
            </div>
            {listing.verified ? <BadgeCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary-600" /> : null}
          </div>

          <div className="mt-4 flex items-end gap-1 text-gray-900">
            <IndianRupee className="mb-1 h-4 w-4 text-gray-500" />
            <span className="text-2xl font-bold tracking-tight">{listing.pricing.monthlyFee.toLocaleString()}</span>
            <span className="pb-1 text-sm text-gray-500">/ month</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {listing.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="neutral">
                {specialty}
              </Badge>
            ))}
            {listing.specialties.length > 2 ? <Badge variant="outline">+{listing.specialties.length - 2} more</Badge> : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-medium text-primary-700">
            <span>View details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

const ListingCard = memo(ListingCardComponent);

export default ListingCard;
