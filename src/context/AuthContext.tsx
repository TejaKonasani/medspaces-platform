'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser, UserRoleType, PermissionType } from '@/lib/auth';

interface AuthState {
  user: AuthUser | null;
  permissions: PermissionType[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRoleType }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  hasPermission: (permission: PermissionType) => boolean;
  hasRole: (role: UserRoleType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    permissions: [],
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        cache: 'no-store',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.user) {
          setState({
            user: data.data.user,
            permissions: data.data.permissions || [],
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
      setState({ user: null, permissions: [], isLoading: false, isAuthenticated: false });
    } catch {
      setState({ user: null, permissions: [], isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.data?.user) {
        setState({
          user: data.data.user,
          permissions: [],
          isLoading: false,
          isAuthenticated: true,
        });
        await refreshAuth();
        return { success: true, role: data.data.user.role };
      }

      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    setState({ user: null, permissions: [], isLoading: false, isAuthenticated: false });
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
      });
    } finally {
      setState({ user: null, permissions: [], isLoading: false, isAuthenticated: false });
    }
  };

  const hasPermission = (permission: PermissionType): boolean => {
    return state.permissions.includes(permission);
  };

  const hasRole = (role: UserRoleType): boolean => {
    return state.user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshAuth, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
