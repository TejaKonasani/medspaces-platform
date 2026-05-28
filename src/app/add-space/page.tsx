'use client';

import { useState } from 'react';
import { Building2, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';
import { specialties, cities } from '@/data/listing-options';
import { Alert, Badge, Button, Card, Input, Select, Textarea, useToast } from '@/components/ui';

export default function AddSpacePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { success, error: showError } = useToast();

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
      const data = await api.listings.create(payload);

      if (data.success) {
        setSubmitted(true);
        success('Listing submitted', 'Your space has been sent for review.');
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.error || 'Submission failed. Please check your inputs.');
        showError('Submission failed', data.error || 'Please check your inputs.');
      }
    } catch {
      setError('Network error. Please try again.');
      showError('Network error', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center bg-slate-50/80 px-4 py-16">
        <Card className="max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">Listing submitted</h2>
          <p className="mt-3 text-gray-600">
            Thank you for submitting your space. Our admin team will review your listing and publish it after verification.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="bg-gradient-to-br from-secondary-600 via-secondary-700 to-slate-950 text-white">
        <div className="section-padding py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Listing onboarding
            </Badge>
            <div className="mt-4 flex items-center gap-3">
              <Building2 className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight">List your space</h1>
            </div>
            <p className="mt-3 text-lg text-secondary-100">Submit your consultation room details and connect with doctors through a clean review workflow.</p>
          </div>
        </div>
      </section>

      <section className="section-padding py-10">
        <div className="mx-auto max-w-4xl">
          {error ? <Alert variant="error" title="We could not submit your listing" className="mb-6">{error}</Alert> : null}

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">Facility information</h2>
                  <Badge variant="neutral">Step 1</Badge>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Clinic / hospital name" required value={formData.clinicName} onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })} error={fieldErrors.clinicName?.[0]} />
                  <Select label="Facility type" required value={formData.facilityType} onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })} error={fieldErrors.facilityType?.[0]}>
                    <option value="">Select type</option>
                    <option value="clinic">Clinic</option>
                    <option value="hospital">Hospital</option>
                    <option value="diagnostic_center">Diagnostic Center</option>
                    <option value="polyclinic">Polyclinic</option>
                  </Select>
                  <Input label="Contact person" required value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
                  <Input label="Mobile number" required type="tel" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} error={fieldErrors.phone?.[0]} />
                  <Input label="Email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={fieldErrors.email?.[0]} />
                  <Select label="City" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                    <option value="">Select city</option>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </Select>
                </div>

                <div className="mt-5 grid gap-5">
                  <Input label="Locality" value={formData.locality} onChange={(e) => setFormData({ ...formData, locality: e.target.value })} placeholder="e.g. Kondapur, Koramangala" />
                  <Textarea label="Full address" required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} error={fieldErrors.address?.[0]} />
                  <Input label="Google Maps link" type="url" value={formData.mapsLocation} onChange={(e) => setFormData({ ...formData, mapsLocation: e.target.value })} placeholder="https://maps.google.com/..." />
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">Room and pricing</h2>
                  <Badge variant="neutral">Step 2</Badge>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Consultation rooms available" required type="number" min="1" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} />
                  <Select label="Pricing model" required value={formData.pricingModel} onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}>
                    <option value="">Select</option>
                    <option value="monthly">Monthly rent</option>
                    <option value="per-slot">Per slot</option>
                    <option value="both">Both options</option>
                  </Select>
                  <Input label="Monthly fee (₹)" type="number" value={formData.monthlyFee} onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })} />
                  <Select label="Availability" required value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })}>
                    <option value="">Select</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="all-days">All days</option>
                    <option value="custom">Custom</option>
                  </Select>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">Preferred specialties</h2>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <p className="text-sm text-gray-500">Select specialties you would prefer for the consulting doctors.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {specialties.map((specialty) => {
                    const checked = formData.preferredSpecialties.includes(specialty);

                    return (
                      <label key={specialty} className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${checked ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) setFormData({ ...formData, preferredSpecialties: [...formData.preferredSpecialties, specialty] });
                            else setFormData({ ...formData, preferredSpecialties: formData.preferredSpecialties.filter((item) => item !== specialty) });
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        {specialty}
                      </label>
                    );
                  })}
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={loading} variant="secondary">
                Submit listing for review
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
