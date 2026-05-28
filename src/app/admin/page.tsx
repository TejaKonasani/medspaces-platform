'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock3,
  Download,
  Eye,
  FilterX,
  LogOut,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAvailableInquiryTransitions, getInquiryStatusLabel, INQUIRY_STATUSES } from '@/lib/inquiries';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/cn';
import type { Doctor, InquiryActivity, InquiryDetail, InquiryListItem, InquiryWorkflowStatus, Listing } from '@/types';
import { Alert, Badge, Button, Card, EmptyState, Input, LoadingSpinner, Modal, SkeletonTableRows, Textarea, useToast } from '@/components/ui';

type Tab = 'listings' | 'doctors' | 'inquiries';
type InquiryStatusFilter = 'all' | InquiryWorkflowStatus;
type ListingModerationAction = 'APPROVE' | 'REJECT' | 'VERIFY';
type DoctorModerationAction = 'VERIFY' | 'DEACTIVATE' | 'ACTIVATE';
type AdminDetailView =
  | { kind: 'doctor'; doctor: Doctor }
  | { kind: 'listing'; listing: Listing };

const tabs: Array<{ id: Tab; label: string; icon: typeof Building2 }> = [
  { id: 'listings', label: 'Listings', icon: Building2 },
  { id: 'doctors', label: 'Doctors', icon: Users },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
];

const inquiryStatusVariant: Record<InquiryWorkflowStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  NEW: 'info',
  CONTACTED: 'warning',
  IN_DISCUSSION: 'warning',
  MATCHED: 'success',
  CLOSED: 'neutral',
  REJECTED: 'neutral',
};

function formatDate(value?: string) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return 'Not available';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function AdminActionGroup({
  viewLabel,
  approveLabel,
  rejectLabel,
  featureLabel,
  onView,
  onApprove,
  onReject,
  onFeature,
  loading,
}: {
  viewLabel: string;
  approveLabel: string;
  rejectLabel: string;
  featureLabel?: string;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFeature?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1">
      <Button variant="ghost" size="sm" className="h-9 w-9 px-0" onClick={onView} title={viewLabel} aria-label={viewLabel}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-9 w-9 px-0 text-green-600 hover:text-green-700" onClick={onApprove} isLoading={loading} title={approveLabel} aria-label={approveLabel}>
        <CheckCircle className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-9 w-9 px-0 text-red-600 hover:text-red-700" onClick={onReject} isLoading={loading} title={rejectLabel} aria-label={rejectLabel}>
        <Star className="h-4 w-4" />
      </Button>
      {featureLabel ? (
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0 text-amber-600 hover:text-amber-700" onClick={onFeature} isLoading={loading} title={featureLabel} aria-label={featureLabel}>
          <Star className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('inquiries');
  const [listings, setListings] = useState<Listing[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [inquiries, setInquiries] = useState<InquiryListItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatusFilter>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryDetail | null>(null);
  const [activity, setActivity] = useState<InquiryActivity[]>([]);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowSaving, setWorkflowSaving] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteError, setNoteError] = useState('');
  const [moderationSavingKey, setModerationSavingKey] = useState('');
  const [detailView, setDetailView] = useState<AdminDetailView | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();

  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      setLoadError('');

      const [listingsRes, doctorsRes, inquiriesRes] = await Promise.all([
        api.listings.getAll({ limit: 1000 }),
        api.doctors.getAll(),
        api.inquiries.getAll({ page: 1, limit: 100 }),
      ]);

      if (!listingsRes.success) throw new Error(listingsRes.error || 'Failed to load listings');
      if (!doctorsRes.success) throw new Error(doctorsRes.error || 'Failed to load doctors');
      if (!inquiriesRes.success) throw new Error(inquiriesRes.error || 'Failed to load inquiries');

      setListings(listingsRes.data ?? []);
      setDoctors(doctorsRes.data ?? []);
      setInquiries(inquiriesRes.data ?? []);
    } catch (loadFailure) {
      setLoadError(loadFailure instanceof Error ? loadFailure.message : 'Failed to load admin data');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace('/login?redirect=/admin');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.replace('/browse');
      return;
    }

    if (isAdmin) {
      void loadAdminData();
    }
  }, [isAdmin, isAuthenticated, isLoading, router, user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const openInquiryWorkflow = async (id: string) => {
    try {
      setWorkflowOpen(true);
      setWorkflowLoading(true);

      const [detailRes, activityRes] = await Promise.all([
        api.inquiries.getById(id),
        api.inquiries.getActivity(id),
      ]);

      if (!detailRes.success || !detailRes.data) {
        throw new Error(detailRes.error || 'Failed to load inquiry');
      }

      if (!activityRes.success) {
        throw new Error(activityRes.error || 'Failed to load inquiry activity');
      }

      setSelectedInquiry(detailRes.data);
      setNoteDraft(detailRes.data.adminNotes ?? '');
      setNoteError('');
      setActivity(activityRes.data ?? []);
    } catch (workflowError) {
      error('Workflow load failed', workflowError instanceof Error ? workflowError.message : 'Unable to open workflow detail');
      setWorkflowOpen(false);
    } finally {
      setWorkflowLoading(false);
    }
  };

  const openDoctorDetails = (doctor: Doctor) => {
    setDetailView({ kind: 'doctor', doctor });
    setDetailOpen(true);
  };

  const openListingDetails = (listing: Listing) => {
    setDetailView({ kind: 'listing', listing });
    setDetailOpen(true);
  };

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setDetailView(null);
    }
  }, []);

  const handleStatusUpdate = async (status: InquiryWorkflowStatus) => {
    if (!selectedInquiry) return;

    try {
      setWorkflowSaving(true);
      const response = await api.inquiries.updateStatus(selectedInquiry.id, status);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update inquiry status');
      }

      setSelectedInquiry(response.data);
      setInquiries((current) => current.map((inquiry) => (inquiry.id === response.data?.id ? response.data : inquiry)));
      const activityRes = await api.inquiries.getActivity(selectedInquiry.id);
      if (activityRes.success) {
        setActivity(activityRes.data ?? []);
      }
      success('Status updated', `Inquiry moved to ${getInquiryStatusLabel(status)}.`);
    } catch (statusError) {
      error('Status update failed', statusError instanceof Error ? statusError.message : 'Unable to update inquiry');
    } finally {
      setWorkflowSaving(false);
    }
  };

  const handleNotesSave = async () => {
    if (!selectedInquiry) return;

    const trimmedNote = noteDraft.trim();
    if (trimmedNote.length < 2) {
      setNoteError('Admin note must be at least 2 characters.');
      error('Note save failed', 'Please enter at least 2 characters.');
      return;
    }

    try {
      setNoteError('');
      setWorkflowSaving(true);
      const response = await api.inquiries.updateNotes(selectedInquiry.id, trimmedNote);
      if (!response.success || !response.data) {
        const fieldMessage = response.errors?.adminNotes?.[0];
        if (fieldMessage) {
          setNoteError(fieldMessage);
        }
        throw new Error(response.error || 'Failed to save admin notes');
      }

      setSelectedInquiry(response.data);
      setInquiries((current) => current.map((inquiry) => (inquiry.id === response.data?.id ? response.data : inquiry)));
      setNoteDraft(response.data.adminNotes ?? trimmedNote);
      const activityRes = await api.inquiries.getActivity(selectedInquiry.id);
      if (activityRes.success) {
        setActivity(activityRes.data ?? []);
      }
      success('Admin note saved', 'Workflow note updated successfully.');
    } catch (noteError) {
      error('Note save failed', noteError instanceof Error ? noteError.message : 'Unable to save admin notes');
    } finally {
      setWorkflowSaving(false);
    }
  };

  const handleListingModeration = async (listingId: string, action: ListingModerationAction) => {
    try {
      setModerationSavingKey(`listing:${listingId}`);
      const response = await api.listings.moderate(listingId, action);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update listing moderation');
      }

      const updatedListing = response.data;
      setListings((current) => current.map((listing) => (listing.id === updatedListing.id ? updatedListing : listing)));
      success('Listing updated', action === 'REJECT' ? 'Listing rejected successfully.' : 'Listing approved successfully.');
    } catch (moderationError) {
      error('Listing update failed', moderationError instanceof Error ? moderationError.message : 'Unable to update listing');
    } finally {
      setModerationSavingKey('');
    }
  };

  const handleDoctorModeration = async (doctorId: string, action: DoctorModerationAction) => {
    try {
      setModerationSavingKey(`doctor:${doctorId}`);
      const response = await api.doctors.moderate(doctorId, action);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update doctor moderation');
      }

      const updatedDoctor = response.data;
      setDoctors((current) => current.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor)));
      success('Doctor updated', action === 'DEACTIVATE' ? 'Doctor has been deactivated.' : 'Doctor has been verified successfully.');
    } catch (moderationError) {
      error('Doctor update failed', moderationError instanceof Error ? moderationError.message : 'Unable to update doctor');
    } finally {
      setModerationSavingKey('');
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (!deferredSearchTerm) return true;
      return [listing.clinicName, listing.city, listing.locality, listing.facilityType].join(' ').toLowerCase().includes(deferredSearchTerm);
    });
  }, [deferredSearchTerm, listings]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      if (!deferredSearchTerm) return true;
      return [doctor.fullName, doctor.specialty, doctor.preferredLocations?.join(' ') || ''].join(' ').toLowerCase().includes(deferredSearchTerm);
    });
  }, [deferredSearchTerm, doctors]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const matchesSearch =
        !deferredSearchTerm ||
        [inquiry.doctorName, inquiry.specialty, inquiry.email, inquiry.listing?.clinicName || 'general inquiry']
          .join(' ')
          .toLowerCase()
          .includes(deferredSearchTerm);

      const matchesStatus = inquiryStatus === 'all' || inquiry.status === inquiryStatus;
      return matchesSearch && matchesStatus;
    });
  }, [deferredSearchTerm, inquiries, inquiryStatus]);

  const inquiryCounts = useMemo(() => {
    return INQUIRY_STATUSES.reduce<Record<InquiryWorkflowStatus, number>>((accumulator, status) => {
      accumulator[status] = inquiries.filter((inquiry) => inquiry.status === status).length;
      return accumulator;
    }, {
      NEW: 0,
      CONTACTED: 0,
      IN_DISCUSSION: 0,
      MATCHED: 0,
      CLOSED: 0,
      REJECTED: 0,
    });
  }, [inquiries]);

  const currentResults = activeTab === 'listings' ? filteredListings.length : activeTab === 'doctors' ? filteredDoctors.length : filteredInquiries.length;

  const handleWorkflowOpenChange = useCallback((open: boolean) => {
    setWorkflowOpen(open);
    if (!open) {
      setSelectedInquiry(null);
      setActivity([]);
      setNoteDraft('');
      setNoteError('');
    }
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  if (loadingData) {
    return (
      <div className="page-shell min-h-screen bg-slate-50/80">
        <div className="section-padding py-10">
          <div className="grid gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-5">
                <LoadingSpinner label="Loading dashboard" />
              </Card>
            ))}
          </div>
          <Card className="mt-6 overflow-hidden p-6">
            <SkeletonTableRows rows={6} columns={5} />
          </Card>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total listings', value: listings.length, helper: `${listings.filter((listing) => listing.verified).length} verified`, icon: Building2, tone: 'primary' as const },
    { label: 'Registered doctors', value: doctors.length, helper: 'Onboarded profiles', icon: Users, tone: 'secondary' as const },
    { label: 'New inquiries', value: inquiryCounts.NEW, helper: `${inquiries.length} total workflow items`, icon: Clock3, tone: 'primary' as const },
    { label: 'Matched inquiries', value: inquiryCounts.MATCHED, helper: `${inquiryCounts.IN_DISCUSSION} in discussion`, icon: Star, tone: 'secondary' as const },
  ];

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || 'Overview';

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="section-padding py-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <Badge variant="info">
                <Sparkles className="mr-2 h-3.5 w-3.5" /> Admin console
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">Inquiry operations dashboard</h1>
              <p className="mt-2 text-balance text-sm leading-6 text-gray-500">
                Manage inquiry lifecycle, operational follow-up, and workflow visibility from one responsive workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">
                <Shield className="mr-2 h-3.5 w-3.5" /> {user.role}
              </Badge>
              <Button variant="ghost" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="section-padding py-6">
        {loadError ? (
          <Alert
            variant="error"
            title="Failed to load admin data"
            className="mb-6"
            action={<Button variant="outline" size="sm" onClick={() => void loadAdminData()}>Retry</Button>}
          >
            {loadError}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="overflow-hidden p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-gray-500">{stat.helper}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', stat.tone === 'primary' ? 'bg-primary-50 text-primary-600' : 'bg-secondary-50 text-secondary-600')}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div id="workflow" className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Operational workspace</h2>
                  <p className="text-sm text-gray-500">Search, filter, and manage workflows without leaving the dashboard.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{currentResults} visible</Badge>
                  <Badge variant="neutral">{activeTabLabel}</Badge>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'interactive-ring inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold',
                        activeTab === tab.id ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/25' : 'bg-slate-50 text-gray-600 hover:bg-white'
                      )}
                      aria-pressed={activeTab === tab.id}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={`Search ${activeTabLabel.toLowerCase()}`}
                    leftIcon={<Search className="h-4 w-4" />}
                    className="min-w-[220px]"
                    aria-label={`Search ${activeTabLabel.toLowerCase()}`}
                  />
                  {activeTab === 'inquiries' ? (
                    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1">
                      {(['all', ...INQUIRY_STATUSES] as InquiryStatusFilter[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setInquiryStatus(status)}
                          className={cn(
                            'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                            inquiryStatus === status ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-slate-50'
                          )}
                        >
                          {status === 'all' ? 'All' : getInquiryStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {activeTab === 'listings' ? (
              filteredListings.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title={searchTerm ? 'No listings match this search' : 'No listings available'}
                    description={searchTerm ? 'Try a broader clinic, city, or facility search.' : 'New clinic listings will appear here after submission.'}
                    icon={<Building2 className="h-6 w-6" />}
                    action={searchTerm ? <Button variant="outline" onClick={() => setSearchTerm('')} leftIcon={<FilterX className="h-4 w-4" />}>Clear search</Button> : undefined}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-subtle">
                  <table className="table-sticky-head min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Clinic</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Location</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredListings.map((listing) => (
                        <tr key={listing.id} className="transition-colors hover:bg-slate-50/80">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-gray-900">{listing.clinicName}</div>
                            <div className="mt-1 text-xs text-gray-400">Added {formatDate(listing.createdAt)}</div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">
                            <div>{listing.locality}</div>
                            <div className="text-xs text-gray-400">{listing.city}</div>
                          </td>
                          <td className="px-5 py-4 text-gray-600 capitalize">{listing.facilityType.replace('_', ' ')}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={listing.moderationStatus === 'REJECTED' ? 'neutral' : listing.verified ? 'success' : 'warning'}>
                                {listing.moderationStatus === 'REJECTED' ? 'Rejected' : listing.verified ? 'Verified' : 'Pending review'}
                              </Badge>
                              {listing.moderationStatus === 'APPROVED' ? <Badge variant="info">Approved</Badge> : null}
                              {listing.featured ? <Badge variant="info">Featured</Badge> : null}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <AdminActionGroup
                              viewLabel="View listing"
                              approveLabel="Approve listing"
                              rejectLabel="Reject listing"
                              featureLabel="Verify listing"
                              onView={() => openListingDetails(listing)}
                              onApprove={() => void handleListingModeration(listing.id, 'APPROVE')}
                              onReject={() => void handleListingModeration(listing.id, 'REJECT')}
                              onFeature={() => void handleListingModeration(listing.id, 'VERIFY')}
                              loading={moderationSavingKey === `listing:${listing.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}

            {activeTab === 'doctors' ? (
              filteredDoctors.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title={searchTerm ? 'No doctors match this search' : 'No doctors registered yet'}
                    description={searchTerm ? 'Try a broader name, specialty, or location search.' : 'Doctor registrations will appear here once they complete onboarding.'}
                    icon={<Users className="h-6 w-6" />}
                    action={searchTerm ? <Button variant="outline" onClick={() => setSearchTerm('')} leftIcon={<FilterX className="h-4 w-4" />}>Clear search</Button> : undefined}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-subtle">
                  <table className="table-sticky-head min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Doctor</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Specialty</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Preferred city</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDoctors.map((doctor) => (
                        <tr key={doctor.id} className="transition-colors hover:bg-slate-50/80">
                          <td className="px-5 py-4 font-medium text-gray-900">
                            <div>{doctor.fullName}</div>
                            <div className="mt-1 text-xs text-gray-400">Joined {formatDate(doctor.createdAt)}</div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{doctor.specialty}</td>
                          <td className="px-5 py-4 text-gray-600">{doctor.preferredLocations?.[0] || 'Not specified'}</td>
                          <td className="px-5 py-4">
                            <Badge variant={doctor.status === 'VERIFIED' ? 'success' : doctor.status === 'INACTIVE' ? 'neutral' : 'warning'}>
                              {doctor.status === 'VERIFIED' ? 'Verified' : doctor.status === 'INACTIVE' ? 'Inactive' : 'Pending'}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <AdminActionGroup
                              viewLabel="View doctor"
                              approveLabel="Verify doctor"
                              rejectLabel="Deactivate doctor"
                              featureLabel="Activate doctor"
                              onView={() => openDoctorDetails(doctor)}
                              onApprove={() => void handleDoctorModeration(doctor.id, 'VERIFY')}
                              onReject={() => void handleDoctorModeration(doctor.id, 'DEACTIVATE')}
                              onFeature={() => void handleDoctorModeration(doctor.id, 'ACTIVATE')}
                              loading={moderationSavingKey === `doctor:${doctor.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}

            {activeTab === 'inquiries' ? (
              filteredInquiries.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title={searchTerm || inquiryStatus !== 'all' ? 'No inquiries match these filters' : 'No inquiries available'}
                    description={searchTerm || inquiryStatus !== 'all' ? 'Clear the search or status filter to see more workflow activity.' : 'Inquiry requests will appear here once doctors submit them.'}
                    icon={<MessageSquare className="h-6 w-6" />}
                    action={
                      searchTerm || inquiryStatus !== 'all'
                        ? <Button variant="outline" onClick={() => { setSearchTerm(''); setInquiryStatus('all'); }} leftIcon={<FilterX className="h-4 w-4" />}>Reset filters</Button>
                        : undefined
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-subtle">
                  <table className="table-sticky-head min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Doctor</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Clinic</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Last update</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredInquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="transition-colors hover:bg-slate-50/80">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-gray-900">{inquiry.doctorName}</div>
                            <div className="mt-1 text-xs text-gray-400">{inquiry.specialty}</div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{inquiry.listing?.clinicName || 'General inquiry'}</td>
                          <td className="px-5 py-4">
                            <Badge variant={inquiryStatusVariant[inquiry.status]}>{getInquiryStatusLabel(inquiry.status)}</Badge>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{formatDate(inquiry.updatedAt || inquiry.createdAt)}</td>
                          <td className="px-5 py-4">
                            <Button variant="outline" size="sm" onClick={() => void openInquiryWorkflow(inquiry.id)}>
                              Manage workflow
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : null}
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Workflow summary</h2>
                  <p className="text-sm text-gray-500">Operational status distribution.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {INQUIRY_STATUSES.map((status) => (
                  <div key={status} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={cn('status-dot', status === 'NEW' ? 'bg-primary-500' : status === 'MATCHED' ? 'bg-emerald-500' : status === 'REJECTED' ? 'bg-slate-400' : 'bg-amber-500')} />
                      <span className="text-sm font-medium text-gray-700">{getInquiryStatusLabel(status)}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{inquiryCounts[status]}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Exports</h2>
                  <p className="text-sm text-gray-500">Reserved for future reporting jobs.</p>
                </div>
                <Download className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-5 space-y-3">
                <Button variant="outline" fullWidth disabled leftIcon={<Download className="h-4 w-4" />}>
                  Export inquiries CSV
                </Button>
                <Button variant="outline" fullWidth disabled leftIcon={<Download className="h-4 w-4" />}>
                  Export workflow activity
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        open={workflowOpen}
        onOpenChange={handleWorkflowOpenChange}
        title={selectedInquiry ? `Inquiry workflow: ${selectedInquiry.doctorName}` : 'Inquiry workflow'}
        description="Review lifecycle state, update admin notes, and inspect the activity timeline."
        className="max-w-4xl"
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">Workflow actions persist immediately and create timeline entries.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setWorkflowOpen(false)}>Close</Button>
              <Button onClick={() => void handleNotesSave()} isLoading={workflowSaving}>Save notes</Button>
            </div>
          </div>
        }
      >
        {workflowLoading || !selectedInquiry ? (
          <div className="py-10">
            <LoadingSpinner label="Loading inquiry workflow" />
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4">
                  <p className="text-sm text-gray-500">Current status</p>
                  <div className="mt-3">
                    <Badge variant={inquiryStatusVariant[selectedInquiry.status]}>{getInquiryStatusLabel(selectedInquiry.status)}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Last updated {formatDate(selectedInquiry.updatedAt || selectedInquiry.createdAt)}</p>
                </Card>
              </div>

              <Card className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">Workflow actions</h3>
                <p className="mt-1 text-sm text-gray-500">Available transitions are derived from the centralized workflow rules.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {getAvailableInquiryTransitions(selectedInquiry.status).map((status) => (
                    <Button key={status} variant="outline" onClick={() => void handleStatusUpdate(status)} isLoading={workflowSaving}>
                      Move to {getInquiryStatusLabel(status)}
                    </Button>
                  ))}
                  {getAvailableInquiryTransitions(selectedInquiry.status).length === 0 ? (
                    <Badge variant="neutral">No further transitions available</Badge>
                  ) : null}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">Admin notes</h3>
                <p className="mt-1 text-sm text-gray-500">Use notes for internal handoff context and operational commentary.</p>
                <div className="mt-4">
                  <Textarea
                    label="Workflow notes"
                    rows={6}
                    value={noteDraft}
                    onChange={(event) => {
                      setNoteDraft(event.target.value);
                      if (noteError) setNoteError('');
                    }}
                    error={noteError}
                    hint="Notes are stored on the inquiry and also written into the activity timeline."
                  />
                </div>
              </Card>
            </div>

            <Card className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">Activity timeline</h3>
              <p className="mt-1 text-sm text-gray-500">Audit history for workflow state changes and admin updates.</p>
              <div className="mt-5 space-y-4">
                {activity.length === 0 ? (
                  <EmptyState
                    title="No timeline events yet"
                    description="Timeline entries will appear here as the inquiry moves through the workflow."
                    icon={<Clock3 className="h-6 w-6" />}
                    className="px-4 py-8"
                  />
                ) : (
                  <div className="stagger-in space-y-4">
                    {activity.map((event) => (
                      <div key={event.id} className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{event.title}</p>
                            {event.description ? <p className="mt-1 text-sm leading-6 text-gray-500">{event.description}</p> : null}
                          </div>
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">{event.type.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {event.fromStatus ? <Badge variant="outline">{getInquiryStatusLabel(event.fromStatus)}</Badge> : null}
                          {event.toStatus ? <Badge variant="info">{getInquiryStatusLabel(event.toStatus)}</Badge> : null}
                        </div>
                        <p className="mt-3 text-xs text-gray-400">{formatDate(event.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        title={
          detailView?.kind === 'doctor'
            ? `Doctor details: ${detailView.doctor.fullName}`
            : detailView?.kind === 'listing'
              ? `Listing details: ${detailView.listing.clinicName}`
              : 'Details'
        }
        description="Inline reference view for admin review without leaving the table context."
        className="max-w-5xl"
        footer={
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {!detailView ? null : detailView.kind === 'doctor' ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Identity</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Name</p>
                  <p className="mt-1 font-semibold text-gray-900">{detailView.doctor.fullName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Email</p>
                  <p className="mt-1 text-sm text-gray-600">{detailView.doctor.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Phone</p>
                  <p className="mt-1 text-sm text-gray-600">{detailView.doctor.mobile || 'Not available'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-sm text-gray-500">Verification</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={detailView.doctor.status === 'VERIFIED' ? 'success' : detailView.doctor.status === 'INACTIVE' ? 'neutral' : 'warning'}>
                  {detailView.doctor.status === 'VERIFIED' ? 'Verified' : detailView.doctor.status === 'INACTIVE' ? 'Inactive' : 'Pending'}
                </Badge>
                <Badge variant="outline">Joined {formatDate(detailView.doctor.createdAt)}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Registration:</span> {detailView.doctor.registrationNumber || 'Not available'}</p>
                <p><span className="font-medium text-gray-900">Qualification:</span> {detailView.doctor.qualification || 'Not available'}</p>
                <p><span className="font-medium text-gray-900">Experience:</span> {detailView.doctor.experience >= 0 ? `${detailView.doctor.experience} years` : 'Not available'}</p>
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <p className="text-sm text-gray-500">Practice details</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Specialty</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.specialty}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Sub specialty</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.subSpecialty || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Practice model</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.practiceModel || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Consulting times</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.consultingTimes || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Preferred locations</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.preferredLocations?.length ? detailView.doctor.preferredLocations.join(', ') : 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Affiliations</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.doctor.affiliations || 'Not available'}</p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm text-gray-500">Clinic overview</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Clinic name</p>
                  <p className="mt-1 font-semibold text-gray-900">{detailView.listing.clinicName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Facility type</p>
                  <p className="mt-1 text-sm text-gray-600 capitalize">{detailView.listing.facilityType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Address</p>
                  <p className="mt-1 text-sm text-gray-600">{detailView.listing.address}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-sm text-gray-500">Moderation</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={detailView.listing.moderationStatus === 'REJECTED' ? 'neutral' : detailView.listing.verified ? 'success' : 'warning'}>
                  {detailView.listing.moderationStatus === 'REJECTED' ? 'Rejected' : detailView.listing.verified ? 'Verified' : 'Pending review'}
                </Badge>
                {detailView.listing.featured ? <Badge variant="info">Featured</Badge> : null}
                <Badge variant="outline">Added {formatDate(detailView.listing.createdAt)}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Contact person:</span> {detailView.listing.contactPerson || 'Not available'}</p>
                <p><span className="font-medium text-gray-900">Phone:</span> {detailView.listing.phone || 'Not available'}</p>
                <p><span className="font-medium text-gray-900">Email:</span> {detailView.listing.email || 'Not available'}</p>
                <p><span className="font-medium text-gray-900">WhatsApp:</span> {detailView.listing.whatsapp || 'Not available'}</p>
              </div>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <p className="text-sm text-gray-500">Location, pricing, and specialties</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Location</p>
                  <p className="mt-1 text-sm text-gray-700">{[detailView.listing.locality, detailView.listing.city].filter(Boolean).join(', ')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Monthly fee</p>
                  <p className="mt-1 text-sm text-gray-700">{formatCurrency(detailView.listing.pricing.monthlyFee)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Slot fee</p>
                  <p className="mt-1 text-sm text-gray-700">{formatCurrency(detailView.listing.pricing.slotFee)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Deposit</p>
                  <p className="mt-1 text-sm text-gray-700">{formatCurrency(detailView.listing.pricing.deposit)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Specialties</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.listing.specialties.length ? detailView.listing.specialties.join(', ') : 'Not available'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Availability</p>
                  <p className="mt-1 text-sm text-gray-700">{detailView.listing.availability.days.join(', ')} · {detailView.listing.availability.hours}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
