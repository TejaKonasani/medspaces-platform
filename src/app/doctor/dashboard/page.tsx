import Link from 'next/link';
import { ArrowRight, Clock3, HeartPulse, LayoutDashboard, MapPin, Search, Sparkles, Stethoscope, ClipboardList, Building2 } from 'lucide-react';
import { getCurrentSessionAsync } from '@/lib/session';
import { usersRepository, inquiriesRepository, listingsRepository } from '@/lib/repositories';
import { getInquiryStatusLabel, INQUIRY_STATUSES } from '@/lib/inquiries';
import { Badge, Button, Card, EmptyState } from '@/components/ui';
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

export default async function DoctorDashboardPage() {
  const session = await getCurrentSessionAsync();
  const user = session ? await usersRepository.findById(session.userId) : null;

  if (!session || !user) {
    return null;
  }

  const [inquiryPage, listingPage] = await Promise.all([
    inquiriesRepository.findWorkflowPage({ page: 1, limit: 1000 }, { user }),
    listingsRepository.findMany({ page: 1, limit: 6, sort: [{ createdAt: 'desc' }] }),
  ]);

  const inquiries = inquiryPage.items;
  const recommendedListings = listingPage.items.filter((listing) => listing.verified).slice(0, 4);

  const statusCounts = INQUIRY_STATUSES.reduce<Record<InquiryWorkflowStatus, number>>((counts, status) => {
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

  const recentInquiries = inquiries.slice(0, 6);

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="section-padding py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="info">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Doctor portal
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="mt-3 text-balance text-gray-600">
                Track your inquiries, browse new spaces, and keep your practice moving from one streamlined workspace.
              </p>
            </div>

            <Card className="w-full max-w-md p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Signed in as</p>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="info">Doctor</Badge>
                <Badge variant="outline">{inquiries.length} inquiries</Badge>
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'New', value: statusCounts.NEW, tone: 'info' as const },
              { label: 'Contacted', value: statusCounts.CONTACTED, tone: 'warning' as const },
              { label: 'In discussion', value: statusCounts.IN_DISCUSSION, tone: 'warning' as const },
              { label: 'Matched', value: statusCounts.MATCHED, tone: 'success' as const },
            ].map((stat) => (
              <Card key={stat.label} className="p-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{stat.value}</p>
                <Badge variant={stat.tone} className="mt-3">Inquiry status</Badge>
              </Card>
            ))}
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
                  <p className="mt-1 text-sm text-gray-500">Keep moving between discovery and follow-up.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/browse" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                    <Search className="h-4 w-4" />
                    Browse spaces
                  </Link>
                  <Link href="/inquiry" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                    <ClipboardList className="h-4 w-4" />
                    Submit inquiry
                  </Link>
                </div>
              </div>
            </Card>

            <section id="inquiries" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My inquiries</h2>
                  <p className="mt-1 text-sm text-gray-500">Follow the status of every request you have submitted.</p>
                </div>
                <Badge variant="outline">{inquiries.length} total</Badge>
              </div>

              {recentInquiries.length === 0 ? (
                <EmptyState
                  title="No inquiries yet"
                  description="Start with a listing search and submit your first inquiry. Your activity will appear here once you do."
                  icon={<HeartPulse className="h-6 w-6" />}
                  action={<Link href="/browse" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700">Browse spaces</Link>}
                />
              ) : (
                <div className="grid gap-4">
                  {recentInquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{inquiry.listing?.clinicName || 'General inquiry'}</h3>
                            <Badge variant={statusVariant(inquiry.status)}>{getInquiryStatusLabel(inquiry.status)}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{inquiry.listing ? `${inquiry.listing.locality}, ${inquiry.listing.city}` : 'No listing selected'}</p>
                          <p className="max-w-3xl text-sm leading-6 text-gray-600">{inquiry.message}</p>
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <p className="text-sm text-gray-500">Updated {formatDate(inquiry.updatedAt || inquiry.createdAt)}</p>
                          {inquiry.listingId ? (
                            <Link href={`/listing/${inquiry.listingId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800">
                              View space <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Latest spaces</h2>
                  <p className="text-sm text-gray-500">Fresh listings you can explore next.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {recommendedListings.length === 0 ? (
                  <EmptyState
                    title="No verified listings yet"
                    description="Check back soon or browse the marketplace for all current spaces."
                    icon={<MapPin className="h-6 w-6" />}
                    className="px-4 py-8"
                    action={<Link href="/browse" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700">Browse spaces</Link>}
                  />
                ) : (
                  <div className="space-y-4">
                    {recommendedListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <p className="text-sm text-gray-500">Direct access to your common actions.</p>
                </div>
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-4 grid gap-3">
                <Link href="/doctor/dashboard" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link href="/browse" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Browse spaces
                </Link>
                <Link href="/inquiry" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  Submit inquiry
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
