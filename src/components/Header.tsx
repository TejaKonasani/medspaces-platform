'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, Stethoscope, User, LogOut, ChevronDown, LayoutDashboard, Search, ClipboardList, Building2, PlusCircle, Workflow } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const isAuthenticatedUser = isAuthenticated && user;

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'For Doctors', href: '/for-doctors' },
    { name: 'For Clinics', href: '/for-clinics' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const roleNavigation = !user
    ? []
    : user.role === 'ADMIN'
      ? [
          { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
          { name: 'Workflow Management', href: '/admin/workflow', icon: Workflow },
        ]
      : user.role === 'DOCTOR'
        ? [
            { name: 'Browse Spaces', href: '/browse', icon: Search },
            { name: 'My Inquiries', href: '/doctor/dashboard#inquiries', icon: ClipboardList },
          ]
        : [
            { name: 'My Listings', href: '/clinic/dashboard#listings', icon: Building2 },
            { name: 'Add Listing', href: '/add-space', icon: PlusCircle },
        ];

  const profileDetails = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      phone: user.phone || 'Not provided',
      age: 'Not provided',
      gender: 'Not provided',
      accountType: user.role === 'ADMIN' ? 'Admin account' : user.role === 'DOCTOR' ? 'Doctor account' : 'Clinic account',
      specialty: user.specialty || 'Not provided',
      city: user.city || 'Not provided',
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    router.replace('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="interactive-ring flex items-center gap-3 rounded-2xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-600/20">
              <Stethoscope className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-gray-900">MedSpaces</span>
              <span className="block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Consultation marketplace</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {isAuthenticatedUser ? (
              <>
                {roleNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-offset-0',
                      pathname === item.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}

                <div ref={profileRef} className="relative ml-3 flex items-center gap-3 pl-4">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((current) => !current)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm transition-colors hover:bg-gray-50"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="rounded-full px-3 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    leftIcon={<LogOut className="h-4 w-4" />}
                  >
                    Logout
                  </Button>

                  {isProfileOpen ? (
                    <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-slate-900/10">
                      <div className="bg-gradient-to-br from-primary-700 to-slate-950 px-5 py-4 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-100">Account profile</p>
                        <p className="mt-2 text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-primary-100">{user.email}</p>
                      </div>
                      <div className="space-y-3 px-5 py-4 text-sm">
                        {[
                          { label: 'Role', value: user.role },
                          { label: 'Account type', value: profileDetails?.accountType || 'Not provided' },
                          { label: 'Phone', value: profileDetails?.phone || 'Not provided' },
                          { label: 'Age', value: profileDetails?.age || 'Not provided' },
                          { label: 'Gender', value: profileDetails?.gender || 'Not provided' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                            <span className="font-medium text-gray-500">{item.label}</span>
                            <span className="font-semibold text-gray-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                {publicNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-offset-0',
                      pathname === item.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="ml-4 flex items-center gap-3 pl-4">
                  <Link href="/login" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-700"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

            {isMenuOpen && (
          <div id="mobile-navigation" className="page-transition pb-4 md:hidden">
            <div className="mb-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              {(isAuthenticatedUser ? roleNavigation : publicNavigation).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                    pathname === item.href ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {isAuthenticatedUser ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Signed in as</p>
                    <p className="text-base font-semibold text-gray-900">{user.name}</p>
                  </div>
                  <Badge variant={user.role === 'ADMIN' ? 'info' : user.role === 'DOCTOR' ? 'info' : 'success'}>{user.role}</Badge>
                </div>
                {roleNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="mb-2 flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <item.icon className="h-4 w-4 text-gray-500" />
                    {item.name}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  className="mt-2 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Profile
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {isProfileOpen ? (
                  <div className="mt-2 grid gap-3 rounded-2xl border border-gray-100 bg-slate-50 p-3 text-sm text-gray-700">
                    {[
                      { label: 'Role', value: user.role },
                      { label: 'Account type', value: profileDetails?.accountType || 'Not provided' },
                      { label: 'Phone', value: profileDetails?.phone || 'Not provided' },
                      { label: 'Age', value: profileDetails?.age || 'Not provided' },
                      { label: 'Gender', value: profileDetails?.gender || 'Not provided' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span className="font-medium text-gray-500">{item.label}</span>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <Button variant="outline" fullWidth onClick={handleLogout} className="mt-3 justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <Link href="/login" className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
