import Link from 'next/link';
import { Building2, ClipboardList, LayoutDashboard, MapPin, PlusCircle, Search, Sparkles, Users, BadgeCheck, ArrowRight } from 'lucide-react';
import { getCurrentSessionAsync } from '@/lib/session';
import { usersRepository, listingsRepository, inquiriesRepository } from '@/lib/repositories';
import { getInquiryStatusLabel, INQUIRY_STATUSES } from '@/lib/inquiries';
import { Badge, Card, EmptyState } from '@/components/ui';
import ListingCard from '@/components/ListingCard';
import type { InquiryWorkflowStatus } from '@/types';

function formatDate(value?: string) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusVariant(status: InquiryWorkflowStatus): 'info' | 'warning' | 'success' | 'neutral' {
  switch (status) {
    case 'NEW':
      return 'info';
    case 'CONTACTED':
    case 'IN_DISCUSSION':
      return 'warning';
    case 'MATCHED':
      return 'success';
    case 'CLOSED':
    case 'REJECTED':
      return 'neutral';
  }
}

export default async function ClinicDashboardPage() {
  const session = await getCurrentSessionAsync();
  const user = session ? await usersRepository.findById(session.userId) : null;

  if (!session || !user) {
    return null;
  }

  const [listings, inquiryPage] = await Promise.all([
    listingsRepository.findManyByOwnerUserId(user.id),
    inquiriesRepository.findWorkflowPage({ page: 1, limit: 1000 }, { user }),
  ]);

  const inquiries = inquiryPage.items;
  const verifiedListings = listings.filter((listing) => listing.verified).length;
  const inquiryCounts = INQUIRY_STATUSES.reduce<Record<InquiryWorkflowStatus, number>>((counts, status) => {
    counts[status] = inquiries.filter((inquiry) => inquiry.status === status).length;
    return counts;
  }, {
    NEW: 0,
    CONTACTED: 0,
    IN_DISCUSSION: 0,
    MATCHED: 0,
    CLOSED: 0,
    REJECTED: 0,
  });

  const groupedInquiryCount = inquiries.reduce<Record<string, number>>((counts, inquiry) => {
    const key = inquiry.listing?.id || 'unassigned';
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  const recentInquiries = inquiries.slice(0, 6);

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="section-padding py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="success">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Clinic portal
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="mt-3 text-balance text-gray-600">
                Manage your listings, review incoming inquiries, and keep your clinic profile active from one lightweight workspace.
              </p>
            </div>

            <Card className="w-full max-w-md p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-700">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Signed in as</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="success">Clinic</Badge>
                <Badge variant="outline">{listings.length} listings</Badge>
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-500">Active listings</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{listings.length}</p>
              <p className="mt-2 text-sm text-gray-500">Listings linked to your account</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-500">Verified listings</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{verifiedListings}</p>
              <Badge variant="success" className="mt-3">Verified</Badge>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-500">Total inquiries</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{inquiries.length}</p>
              <p className="mt-2 text-sm text-gray-500">Related to your listings</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-500">Matched inquiries</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{inquiryCounts.MATCHED}</p>
              <Badge variant="info" className="mt-3">Workflow</Badge>
            </Card>
          </div>
        </div>
      </section>

      <div className="section-padding py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Quick actions</h2>
                  <p className="mt-1 text-sm text-gray-500">Keep listings live and easy to discover.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/add-space" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-secondary-700">
                    <PlusCircle className="h-4 w-4" />
                    Add listing
                  </Link>
                  <Link href="/browse" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                    <Search className="h-4 w-4" />
                    Browse spaces
                  </Link>
                </div>
              </div>
            </Card>

            <section id="listings" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My listings</h2>
                  <p className="mt-1 text-sm text-gray-500">Review the spaces currently tied to your clinic account.</p>
                </div>
                <Badge variant="outline">{listings.length} total</Badge>
              </div>

              {listings.length === 0 ? (
                <EmptyState
                  title="No listings yet"
                  description="Add your first consultation room or clinic space to start receiving inquiries."
                  icon={<MapPin className="h-6 w-6" />}
                  action={<Link href="/add-space" className="inline-flex h-11 items-center justify-center rounded-xl bg-secondary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-secondary-700">Add listing</Link>}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {listings.map((listing) => (
                    <div key={listing.id} className="space-y-3">
                      <ListingCard listing={listing} />
                      <Card className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Incoming inquiries</p>
                          <p className="text-lg font-semibold text-gray-900">{groupedInquiryCount[listing.id] || 0}</p>
                        </div>
                        <Badge variant={listing.verified ? 'success' : 'warning'}>{listing.verified ? 'Verified' : 'Pending review'}</Badge>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Incoming inquiries</h2>
                  <p className="text-sm text-gray-500">Requests related to your listings.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {recentInquiries.length === 0 ? (
                  <EmptyState
                    title="No inquiries yet"
                    description="Once doctors submit requests for your spaces, they will appear here."
                    icon={<ClipboardList className="h-6 w-6" />}
                    className="px-4 py-8"
                  />
                ) : (
                  recentInquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{inquiry.doctorName}</p>
                          <p className="mt-1 text-sm text-gray-500">{inquiry.specialty}</p>
                          <p className="mt-2 text-sm text-gray-600">{inquiry.listing?.clinicName || 'General inquiry'}</p>
                        </div>
                        <Badge variant={statusVariant(inquiry.status)}>{getInquiryStatusLabel(inquiry.status)}</Badge>
                      </div>
                      <p className="mt-3 text-xs text-gray-400">Updated {formatDate(inquiry.updatedAt || inquiry.createdAt)}</p>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Workflow summary</h2>
                  <p className="text-sm text-gray-500">Inquiry status distribution.</p>
                </div>
                <Badge variant="outline">{inquiries.length} total</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {INQUIRY_STATUSES.map((status) => (
                  <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{getInquiryStatusLabel(status)}</span>
                    <span className="text-sm font-semibold text-gray-900">{inquiryCounts[status]}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <p className="text-sm text-gray-500">Direct access to your common actions.</p>
                </div>
                <Badge variant="success">Clinic</Badge>
              </div>
              <div className="mt-4 grid gap-3">
                <Link href="/clinic/dashboard" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link href="/add-space" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Add listing
                </Link>
                <Link href="/browse" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Browse spaces
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
