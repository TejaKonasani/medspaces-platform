'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Stethoscope, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Browse Spaces', href: '/browse' },
    { name: 'For Doctors', href: '/for-doctors' },
    { name: 'For Clinics', href: '/for-clinics' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-primary-700">MedSpaces</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user.name.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
                  Sign In
                </Link>
                <Link href="/add-space" className="btn-primary text-sm">
                  List Your Space
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Signed in as {user.name}</p>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block py-2 text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Link
                  href="/login"
                  className="block py-2 text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/add-space"
                  className="block mt-2 btn-primary text-sm text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  List Your Space
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
