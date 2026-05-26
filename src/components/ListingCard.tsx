import Link from 'next/link';
import { MapPin, Building2, BadgeCheck, IndianRupee } from 'lucide-react';
import { Listing } from '@/data/listings';

export default function ListingCard({ listing }: { listing: Listing }) {
  const facilityLabel = {
    clinic: 'Clinic',
    hospital: 'Hospital',
    diagnostic_center: 'Diagnostic Center',
    polyclinic: 'Polyclinic',
  };

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="card cursor-pointer">
        <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-primary-400" />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{listing.clinicName}</h3>
            {listing.verified && (
              <BadgeCheck className="h-5 w-5 text-primary-600 flex-shrink-0 ml-2" />
            )}
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {listing.locality}, {listing.city}
          </div>
          <div className="mt-3 flex items-center text-gray-700">
            <IndianRupee className="h-4 w-4" />
            <span className="font-semibold">{listing.pricing.monthlyFee.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-1">/month</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
              {facilityLabel[listing.facilityType]}
            </span>
            {listing.specialties.slice(0, 2).map((s) => (
              <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {s}
              </span>
            ))}
            {listing.specialties.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{listing.specialties.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
