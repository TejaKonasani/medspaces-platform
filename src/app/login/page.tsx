'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getLandingPathForRole } from '@/lib/auth/portal';
import type { UserRoleType } from '@/lib/auth';
import { Alert, Badge, Button, Card, Input, LoadingSpinner } from '@/components/ui';
import { useToast } from '@/components/ui';

function getRedirectTarget(role?: UserRoleType | null, requestedRedirect?: string | null) {
  const landingPath = getLandingPathForRole(role);

  if (!requestedRedirect) {
    return landingPath;
  }

  if (role === 'ADMIN' && requestedRedirect.startsWith('/admin')) {
    return requestedRedirect;
  }

  if (role === 'DOCTOR' && requestedRedirect.startsWith('/doctor')) {
    return requestedRedirect;
  }

  if (role === 'CLINIC_OWNER' && requestedRedirect.startsWith('/clinic')) {
    return requestedRedirect;
  }

  if (role === 'DOCTOR' && (requestedRedirect.startsWith('/browse') || requestedRedirect.startsWith('/listing') || requestedRedirect.startsWith('/inquiry'))) {
    return requestedRedirect;
  }

  if (role === 'CLINIC_OWNER' && (requestedRedirect.startsWith('/add-space'))) {
    return requestedRedirect;
  }

  return landingPath;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { success, error: showError } = useToast();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const requestedRedirect = searchParams.get('redirect');
  const registrationComplete = searchParams.get('registered') === '1';

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(getRedirectTarget(user?.role, requestedRedirect));
    }
  }, [authLoading, isAuthenticated, requestedRedirect, router, user?.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      success('Signed in successfully', 'Redirecting you to your dashboard.');
      router.replace(getRedirectTarget(result.role, requestedRedirect));
    } else {
      setError(result.error || 'Login failed');
      showError('Sign in failed', result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <LoadingSpinner label="Preparing your account" />
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen bg-slate-50/80 px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white shadow-2xl shadow-slate-950/20">
          <div className="h-full p-8 lg:p-10">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Secure access
            </Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-tight">Welcome back.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-primary-100">
              Sign in to manage your listings, respond to inquiries, and keep your MedSpaces profile current.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Role-aware access to admin and clinic workflows',
                'Persistent sessions with secure cookie handling',
                'Fast API-driven loading and redirect behavior',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <Shield className="h-5 w-5 text-secondary-300" />
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 lg:p-10">
          <div className="mb-8 text-center">
            <Shield className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Sign in to MedSpaces</h2>
            <p className="mt-2 text-sm text-gray-500">Use your account to continue into the workspace.</p>
          </div>

          {error ? (
            <Alert variant="error" title="Sign in failed" className="mb-6">
              {error}
            </Alert>
          ) : null}

          {registrationComplete ? (
            <Alert variant="info" title="Account created" className="mb-6">
              Your registration request is ready. Sign in with the same email to continue.
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              label="Email address"
              required
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              label="Password"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={(
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:text-primary-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            />

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
              Sign in
            </Button>
          </form>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">New to MedSpaces? Create a doctor or clinic account.</p>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
              Create account
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Demo credentials</p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex flex-col gap-1 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">Admin</span>
                <span>admin@medspaces.in / MedAdmin@2024!</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">Doctor</span>
                <span>doctor@medspaces.in / Doctor@2024!</span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">Clinic</span>
                <span>clinic@medspaces.in / Clinic@2024!</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center" />}>
      <LoginPageContent />
    </Suspense>
  );
}
