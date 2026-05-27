'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, MessageSquare, Star, Download, CheckCircle, XCircle, Clock, Eye, LogOut, Loader2, Shield } from 'lucide-react';
import { sampleListings } from '@/data/listings';
import { useAuth } from '@/context/AuthContext';

type Tab = 'listings' | 'doctors' | 'inquiries';

const mockDoctors = [
  { id: '1', name: 'Dr. Sneha Patel', specialty: 'Dermatology', city: 'Hyderabad', status: 'verified', registeredAt: '2024-02-15' },
  { id: '2', name: 'Dr. Arjun Mehta', specialty: 'Psychiatry', city: 'Bangalore', status: 'pending', registeredAt: '2024-03-01' },
  { id: '3', name: 'Dr. Priya Iyer', specialty: 'Endocrinology', city: 'Mumbai', status: 'verified', registeredAt: '2024-02-20' },
  { id: '4', name: 'Dr. Rahul Singh', specialty: 'Orthopedics', city: 'Delhi', status: 'pending', registeredAt: '2024-03-10' },
];

const mockInquiries = [
  { id: '1', doctorName: 'Dr. Sneha Patel', clinic: 'LifeCare Multi-Specialty Clinic', date: '2024-03-15', status: 'new' },
  { id: '2', doctorName: 'Dr. Arjun Mehta', clinic: 'Wellness Hub Polyclinic', date: '2024-03-14', status: 'contacted' },
  { id: '3', doctorName: 'Dr. Priya Iyer', clinic: 'Apollo Reach Clinic', date: '2024-03-13', status: 'matched' },
  { id: '4', doctorName: 'Dr. Rahul Singh', clinic: 'MedPoint Hospital', date: '2024-03-12', status: 'new' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const { user, isLoading, isAuthenticated, logout, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!hasRole('ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-3 text-xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-sm text-gray-500">
            You do not have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 btn-primary"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                <Shield className="h-3 w-3" />
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Listings', value: sampleListings.length, icon: Building2, color: 'primary' },
            { label: 'Registered Doctors', value: mockDoctors.length, icon: Users, color: 'secondary' },
            { label: 'Inquiries', value: mockInquiries.length, icon: MessageSquare, color: 'primary' },
            { label: 'Matches', value: 1, icon: Star, color: 'secondary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1 mb-6">
          {[
            { id: 'listings' as Tab, label: 'Listings', icon: Building2 },
            { id: 'doctors' as Tab, label: 'Doctors', icon: Users },
            { id: 'inquiries' as Tab, label: 'Inquiries', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md font-medium transition-colors ${
                activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Clinic Listings</h2>
              <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Clinic</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">City</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sampleListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{listing.clinicName}</td>
                      <td className="px-4 py-3 text-gray-600">{listing.city}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{listing.facilityType.replace('_', ' ')}</td>
                      <td className="px-4 py-3">
                        {listing.verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            <Clock className="h-3 w-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-primary-600 hover:bg-primary-50 rounded"><Eye className="h-4 w-4" /></button>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="h-4 w-4" /></button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="h-4 w-4" /></button>
                          <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Star className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Registered Doctors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Specialty</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">City</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{doc.name}</td>
                      <td className="px-4 py-3 text-gray-600">{doc.specialty}</td>
                      <td className="px-4 py-3 text-gray-600">{doc.city}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status === 'verified' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="h-4 w-4" /></button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Inquiries</h2>
              <button className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Doctor</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Clinic</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{inq.doctorName}</td>
                      <td className="px-4 py-3 text-gray-600">{inq.clinic}</td>
                      <td className="px-4 py-3 text-gray-600">{inq.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
