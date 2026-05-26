'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { specialties } from '@/data/listings';

export default function InquiryPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing') || '';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    doctorName: '', specialty: '', phone: '', email: '', listingId, message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.error || 'Submission failed. Please check your inputs.');
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
          <h2 className="mt-4 text-2xl font-bold">Inquiry Submitted!</h2>
          <p className="mt-2 text-gray-600">Your inquiry has been sent to the clinic and our team. We&apos;ll facilitate the introduction within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="section-padding py-16">
          <div className="flex items-center gap-3">
            <Send className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Request Introduction</h1>
          </div>
          <p className="mt-3 text-primary-100 text-lg">Let MedSpaces connect you with the clinic</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" required value={formData.doctorName} onChange={(e) => setFormData({...formData, doctorName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['doctorName'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['doctorName'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                <select required value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select</option>
                  {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {fieldErrors['specialty'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['specialty'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['phone'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['phone'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['email'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['email'][0]}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your requirements (minimum 10 characters)..." className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              {fieldErrors['message'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['message'][0]}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
