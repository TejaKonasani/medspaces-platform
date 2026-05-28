'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Building2, Stethoscope, Sparkles, UserPlus } from 'lucide-react';
import { Alert, Badge, Button, Card, Input, Select, useToast } from '@/components/ui';
import { cities, specialties } from '@/data/listing-options';
import { api } from '@/lib/api-client';
import { getLandingPathForRole } from '@/lib/auth/portal';
import { useAuth } from '@/context/AuthContext';
import type { UserRoleType } from '@/lib/auth';

type RoleChoice = 'DOCTOR' | 'CLINIC_OWNER';

export default function RegisterPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const { refreshAuth } = useAuth();
  const [role, setRole] = useState<RoleChoice>('DOCTOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role');
    if (requestedRole === 'CLINIC_OWNER' || requestedRole === 'DOCTOR') {
      setRole(requestedRole);
    }
  }, []);

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const password = formData.password;

    if (!formData.email.includes('@')) errors.email = 'Enter a valid email address.';
    if (password.length > 0 && password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (password.length > 0 && !/[A-Z]/.test(password)) errors.password = 'Password must include an uppercase letter.';
    if (password.length > 0 && !/[a-z]/.test(password)) errors.password = 'Password must include a lowercase letter.';
    if (password.length > 0 && !/[0-9]/.test(password)) errors.password = 'Password must include a number.';
    if (password.length > 0 && !/[^A-Za-z0-9]/.test(password)) errors.password = 'Password must include a special character.';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!formData.name.trim()) errors.name = role === 'DOCTOR' ? 'Doctor name is required.' : 'Clinic name is required.';
    if (role === 'DOCTOR' && !formData.specialty) errors.specialty = 'Specialty is required.';
    if (role === 'CLINIC_OWNER' && !formData.city) errors.city = 'City is required.';

    return errors;
  }, [formData, role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(Object.fromEntries(Object.entries(validationErrors).map(([key, value]) => [key, [value]])));
      setError('Please complete the highlighted fields before continuing.');
      return;
    }

    setLoading(true);

    try {
      const payload = role === 'DOCTOR'
        ? { role, name: formData.name, email: formData.email, password: formData.password, specialty: formData.specialty, phone: formData.phone }
        : { role, clinicName: formData.name, email: formData.email, password: formData.password, city: formData.city, phone: formData.phone };

      const result = await api.auth.register(payload);

      if (!result.success || !result.data?.user) {
        if (result.errors) setFieldErrors(result.errors);
        setError(result.error || 'Registration failed. Please review your details and try again.');
        showError('Registration failed', result.error || 'Please review your details and try again.');
        return;
      }

      await refreshAuth();
      success('Account created', 'You are now signed in and being redirected.');
      router.replace(getLandingPathForRole(result.data.user.role as UserRoleType));
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Could not save your registration right now. Please try again.';
      setError(message);
      showError('Registration failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell min-h-screen bg-slate-50/80 px-4 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white shadow-2xl shadow-slate-950/20">
          <div className="h-full p-8 lg:p-10">
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> Create account
            </Badge>
            <h1 className="mt-6 text-4xl font-bold tracking-tight">Join MedSpaces.</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-primary-100">
              Set up a doctor or clinic account to make browsing, inquiries, and follow-up feel more connected.
            </p>

            <div className="mt-10 grid gap-3 text-sm text-white/90">
              {[
                'Doctor accounts unlock inquiry tracking and space discovery.',
                'Clinic accounts unlock listing management and inbound requests.',
                'The initial onboarding is lightweight and ready for production expansion.',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <CheckCircle2 className="h-5 w-5 text-secondary-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">Account setup</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Choose your account type</h2>
              <p className="mt-2 text-sm text-gray-500">Doctor and clinic onboarding use the same polished sign-up experience.</p>
            </div>
            <div className="flex rounded-2xl border border-gray-200 bg-slate-50 p-1">
              {([
                { value: 'DOCTOR' as RoleChoice, label: 'Doctor', icon: Stethoscope },
                { value: 'CLINIC_OWNER' as RoleChoice, label: 'Clinic', icon: Building2 },
              ]).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${role === item.value ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}
                  aria-pressed={role === item.value}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {error ? <Alert variant="error" title="Registration issue" className="mt-6">{error}</Alert> : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {role === 'DOCTOR' ? (
              <>
                <Input label="Name" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} error={fieldErrors.name?.[0] || validationErrors.name} />
                <Select label="Specialty" required value={formData.specialty} onChange={(event) => setFormData({ ...formData, specialty: event.target.value })} error={fieldErrors.specialty?.[0] || validationErrors.specialty}>
                  <option value="">Select specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </Select>
              </>
            ) : (
              <>
                <Input label="Clinic name" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} error={fieldErrors.name?.[0] || validationErrors.name} />
                <Select label="City" required value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} error={fieldErrors.city?.[0] || validationErrors.city}>
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </>
            )}

            <Input label="Email" required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} error={fieldErrors.email?.[0] || validationErrors.email} />
            <Input label="Password" required type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} error={fieldErrors.password?.[0] || validationErrors.password} hint="Use 8+ chars with uppercase, lowercase, number, and symbol." />
            <Input label="Phone" required type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} error={fieldErrors.phone?.[0] || validationErrors.phone} />

            <Button type="submit" fullWidth isLoading={loading} className="mt-2">
              Create account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
