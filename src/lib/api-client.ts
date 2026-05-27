import type { ApiResponse } from '@/types';

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
      return request<{ user: unknown; sessionId: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    logout() {
      return request<{ message: string }>('/auth/logout', { method: 'POST' });
    },
    me() {
      return request<{ user: unknown; permissions: string[] }>('/auth/me');
    },
  },
  listings: {
    getAll(params?: Record<string, string>) {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return request<unknown>(`/listings${query}`);
    },
    getById(id: string) {
      return request<unknown>(`/listings/${id}`);
    },
    create(data: unknown) {
      return request<unknown>('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update(id: string, data: unknown) {
      return request<unknown>(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete(id: string) {
      return request<unknown>(`/listings/${id}`, { method: 'DELETE' });
    },
  },
  doctors: {
    getAll() {
      return request<unknown>('/doctors');
    },
    register(data: unknown) {
      return request<unknown>('/doctors', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  inquiries: {
    getAll() {
      return request<unknown>('/inquiries');
    },
    create(data: unknown) {
      return request<unknown>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};
