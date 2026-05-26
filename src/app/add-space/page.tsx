'use client';

import { useState } from 'react';
import { Building2, CheckCircle, Loader2 } from 'lucide-react';
import { specialties, cities } from '@/data/listings';

export default function AddSpacePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    clinicName: '', facilityType: '', contactPerson: '', mobile: '', email: '',
    city: '', locality: '', address: '', rooms: '', preferredSpecialties: [] as string[],
    pricingModel: '', monthlyFee: '', availability: '', mapsLocation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const payload = {
      clinicName: formData.clinicName,
      facilityType: formData.facilityType,
      city: formData.city,
      locality: formData.locality || formData.city,
      address: formData.address,
      contactPerson: formData.contactPerson,
      phone: formData.mobile,
      email: formData.email,
      whatsapp: formData.mobile,
      rooms: {
        available: Number(formData.rooms) || 1,
        size: 'TBD',
        furniture: [],
        equipment: [],
      },
      pricing: {
        monthlyFee: Number(formData.monthlyFee) || 0,
      },
      availability: {
        days: formData.availability === 'weekdays'
          ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        hours: '9:00 AM - 6:00 PM',
      },
      infrastructure: {
        parking: false,
        waitingArea: false,
        pharmacy: false,
        diagnostics: false,
        powerBackup: false,
      },
      specialties: formData.preferredSpecialties,
      images: [],
    };

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
          <h2 className="mt-4 text-2xl font-bold">Listing Submitted!</h2>
          <p className="mt-2 text-gray-600">Thank you for submitting your space. Our admin team will review your listing and it will be live within 24-48 hours after verification.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white">
        <div className="section-padding py-16">
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10" />
            <h1 className="text-4xl font-bold">List Your Space</h1>
          </div>
          <p className="mt-3 text-secondary-100 text-lg">Submit your consultation room details and connect with doctors</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">Facility Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic/Hospital Name *</label>
                <input type="text" required value={formData.clinicName} onChange={(e) => setFormData({...formData, clinicName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['clinicName'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['clinicName'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type *</label>
                <select required value={formData.facilityType} onChange={(e) => setFormData({...formData, facilityType: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select Type</option>
                  <option value="clinic">Clinic</option>
                  <option value="hospital">Hospital</option>
                  <option value="diagnostic_center">Diagnostic Center</option>
                  <option value="polyclinic">Polyclinic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                <input type="text" required value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input type="tel" required value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['phone'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['phone'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
                {fieldErrors['email'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['email'][0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select City</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
              <input type="text" value={formData.locality} onChange={(e) => setFormData({...formData, locality: e.target.value})} placeholder="e.g., Kondapur, Koramangala" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              {fieldErrors['address'] && <p className="text-red-500 text-xs mt-1">{fieldErrors['address'][0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
              <input type="url" value={formData.mapsLocation} onChange={(e) => setFormData({...formData, mapsLocation: e.target.value})} placeholder="https://maps.google.com/..." className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <h2 className="text-xl font-semibold border-b pb-3 pt-4">Room & Pricing Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Rooms Available *</label>
                <input type="number" required min="1" value={formData.rooms} onChange={(e) => setFormData({...formData, rooms: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model *</label>
                <select required value={formData.pricingModel} onChange={(e) => setFormData({...formData, pricingModel: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select</option>
                  <option value="monthly">Monthly Rent</option>
                  <option value="per-slot">Per Slot</option>
                  <option value="both">Both Options</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee (₹)</label>
                <input type="number" value={formData.monthlyFee} onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability *</label>
                <select required value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select</option>
                  <option value="weekdays">Weekdays Only</option>
                  <option value="all-days">All Days</option>
                  <option value="custom">Custom (specify in notes)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Specialties</label>
              <p className="text-xs text-gray-500 mb-2">Select specialties you&apos;d prefer for the consulting doctors</p>
              <div className="flex flex-wrap gap-2">
                {specialties.slice(0, 10).map((s) => (
                  <label key={s} className="flex items-center gap-1 px-3 py-1 border rounded-full cursor-pointer hover:bg-gray-50 text-sm">
                    <input type="checkbox" className="rounded text-primary-600" onChange={(e) => {
                      if (e.target.checked) setFormData({...formData, preferredSpecialties: [...formData.preferredSpecialties, s]});
                      else setFormData({...formData, preferredSpecialties: formData.preferredSpecialties.filter(x => x !== s)});
                    }} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary w-full mt-6 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Listing for Review'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
