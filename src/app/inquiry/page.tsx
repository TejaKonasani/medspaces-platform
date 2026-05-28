'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';
import { specialties } from '@/data/listing-options';
import { Alert, Badge, Button, Card, Input, Select, Textarea, useToast } from '@/components/ui';

function InquiryPageContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing') || '';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    doctorName: '', specialty: '', phone: '', email: '', listingId, message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const data = await api.inquiries.create(formData);

      if (data.success) {
        setSubmitted(true);
        success('Inquiry submitted', 'Your introduction request has been sent.');
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
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">Inquiry submitted</h2>
          <p className="mt-3 text-gray-600">Your request has been sent to the clinic and our team. We&apos;ll facilitate the introduction within 24 hours.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-slate-950 text-white">
        <div className="section-padding py-16">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Introduction request
            </Badge>
            <div className="mt-4 flex items-center gap-3">
              <Send className="h-10 w-10" />
              <h1 className="text-4xl font-bold tracking-tight">Request introduction</h1>
            </div>
            <p className="mt-3 text-lg text-primary-100">Let MedSpaces connect you with the clinic through a fast, guided inquiry flow.</p>
          </div>
        </div>
      </section>

      <section className="section-padding py-10" aria-labelledby="inquiry-form-heading">
        <div className="mx-auto max-w-3xl">
          {error ? <Alert variant="error" title="We could not submit your inquiry" className="mb-6">{error}</Alert> : null}

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 id="inquiry-form-heading" className="text-2xl font-semibold tracking-tight text-gray-900">Doctor inquiry details</h2>
                <p className="mt-2 text-sm text-gray-500">Share enough detail for the clinic team to assess fit and respond efficiently.</p>
              </div>
              {listingId ? <Badge variant="info">Selected listing: {listingId}</Badge> : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Your name" required value={formData.doctorName} onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })} error={fieldErrors.doctorName?.[0]} hint="Use the name you want clinics to contact." />
                <Select label="Specialty" required value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} error={fieldErrors.specialty?.[0]}>
                  <option value="">Select</option>
                  {specialties.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
                </Select>
                <Input label="Phone number" required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} error={fieldErrors.phone?.[0]} hint="Include the best number for quick follow-up." />
                <Input label="Email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={fieldErrors.email?.[0]} hint="We will send a copy of the introduction request here." />
              </div>
              <Textarea
                label="Message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your requirements (minimum 10 characters)..."
                error={fieldErrors.message?.[0]}
                hint="Mention preferred timings, expected patient flow, or equipment needs."
              />
              <Button type="submit" fullWidth isLoading={loading}>
                Submit inquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <InquiryPageContent />
    </Suspense>
  );
}
