import type { ApiResponse, Doctor, Inquiry, InquiryActivity, InquiryDetail, InquiryListItem, InquiryWorkflowQueryParams, InquiryWorkflowStatus, Listing, ListingsQueryParams } from '@/types';

export type ListingsResponse = ApiResponse<Listing[]>;
export type ListingResponse = ApiResponse<Listing>;
export type DoctorsResponse = ApiResponse<Doctor[]>;
export type InquiriesResponse = ApiResponse<InquiryListItem[]>;

const BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  return res.json();
}

export const api = {
  auth: {
    login(email: string, password: string) {
      return request<{ user: { id: string; email: string; name: string; role: string; phone?: string | null; specialty?: string | null; city?: string | null }; sessionId: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register(data: unknown) {
      return request<{ user: { id: string; email: string; name: string; role: string; phone?: string | null; specialty?: string | null; city?: string | null }; sessionId: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    logout() {
      return request<{ message: string }>('/auth/logout', { method: 'POST' });
    },
    me() {
      return request<{ user: { id: string; email: string; name: string; role: string; phone?: string | null; specialty?: string | null; city?: string | null }; permissions: string[] }>('/auth/me');
    },
  },
  listings: {
    getAll(params?: ListingsQueryParams) {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.set('search', params.search);
      if (params?.city) queryParams.set('city', params.city);
      if (params?.specialty) queryParams.set('specialty', params.specialty);
      if (params?.facilityType) queryParams.set('facilityType', params.facilityType);
      if (params?.minPrice !== undefined) queryParams.set('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) queryParams.set('maxPrice', String(params.maxPrice));
      if (params?.verified !== undefined) queryParams.set('verified', String(params.verified));
      if (params?.page !== undefined) queryParams.set('page', String(params.page));
      if (params?.limit !== undefined) queryParams.set('limit', String(params.limit));

      const query = queryParams.toString();
      return request<Listing[]>(`/listings${query ? `?${query}` : ''}`);
    },
    getById(id: string) {
      return request<Listing>(`/listings/${id}`);
    },
    create(data: unknown) {
      return request<Listing>('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: unknown) {
      return request<Listing>(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id: string) {
      return request<{ message: string }>(`/listings/${id}`, { method: 'DELETE' });
    },
    moderate(id: string, action: 'APPROVE' | 'REJECT' | 'VERIFY') {
      return request<Listing>(`/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
    },
  },
  doctors: {
    getAll() {
      return request<Doctor[]>('/doctors');
    },
    register(data: unknown) {
      return request<Doctor>('/doctors', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    moderate(id: string, action: 'VERIFY' | 'DEACTIVATE' | 'ACTIVATE') {
      return request<Doctor>(`/doctors/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
    },
  },
  inquiries: {
    getAll(params?: InquiryWorkflowQueryParams) {
      const queryParams = new URLSearchParams();

      if (params?.page !== undefined) queryParams.set('page', String(params.page));
      if (params?.limit !== undefined) queryParams.set('limit', String(params.limit));
      if (params?.search) queryParams.set('search', params.search);
      if (params?.listingId) queryParams.set('listingId', params.listingId);

      if (params?.status) {
        const statuses = Array.isArray(params.status) ? params.status : [params.status];
        statuses.forEach((status) => queryParams.append('status', status));
      }

      const query = queryParams.toString();
      return request<InquiryListItem[]>(`/inquiries${query ? `?${query}` : ''}`);
    },
    create(data: unknown) {
      return request<Inquiry>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getById(id: string) {
      return request<InquiryDetail>(`/inquiries/${id}`);
    },
    updateStatus(id: string, status: InquiryWorkflowStatus) {
      return request<InquiryDetail>(`/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    updateNotes(id: string, adminNotes: string) {
      return request<InquiryDetail>(`/inquiries/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNotes }),
      });
    },
    getActivity(id: string, page = 1, limit = 20) {
      return request<InquiryActivity[]>(`/inquiries/${id}/activity?page=${page}&limit=${limit}`);
    },
  },
};
