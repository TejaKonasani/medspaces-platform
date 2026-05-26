'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { specialties, cities } from '@/data/listings';

export default function DoctorRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    fullName: '', mobile: '', email: '', qualification: '', specialty: '', subSpecialty: '',
    registrationNumber: '', experience: '', preferredLocations: [] as string[],
    consultingTimes: '', practiceModel: '', website: '', linkedin: '', affiliations: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          experience: Number(formData.experience),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.error || 'Registration failed. Please check your inputs.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-secondary-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold">Registration Successful!</h2>
          <p className="mt-2 text-gray-600">Thank you for registering. Our team will verify your profile and you&apos;ll be able to browse and contact listings shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="section-padding py-16">
          <div className="flex items-center gap-3">
            <UserPlus className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Doctor Registration</h1>
          </div>
          <p className="mt-3 text-primary-100 text-lg">Create your professional profile to discover consultation spaces</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['fullName'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['fullName'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['mobile'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['mobile'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['email'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['email'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                <input type="text" required placeholder="e.g., MBBS, MD" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-3 pt-4">Professional Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                <select required value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select Specialty</option>
                  {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldErrors['specialty'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['specialty'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-specialty</label>
                <input type="text" value={formData.subSpecialty} onChange={(e) => setFormData({...formData, subSpecialty: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Registration Number *</label>
                <input type="text" required value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                <input type="number" required min="0" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['experience'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['experience'][0]}</p>}
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-3 pt-4">Preferences</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City *</label>
                <select required onChange={(e) => setFormData({...formData, preferredLocations: [e.target.value]})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Consulting Times</label>
                <select value={formData.consultingTimes} onChange={(e) => setFormData({...formData, consultingTimes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 9PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Model</label>
                <select value={formData.practiceModel} onChange={(e) => setFormData({...formData, practiceModel: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="visiting">Visiting Consultant</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Affiliations</label>
                <input type="text" value={formData.affiliations} onChange={(e) => setFormData({...formData, affiliations: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-3 pt-4">Optional</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                <input type="url" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
