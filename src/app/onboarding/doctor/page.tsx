import Link from 'next/link';
import { LogIn, Stethoscope, UserPlus } from 'lucide-react';
import OnboardingChoice from '@/components/OnboardingChoice';

export default function DoctorOnboardingPage() {
  return (
    <OnboardingChoice
      badge="Doctor onboarding"
      title="How would you like to continue?"
      subtitle="If you already have a MedSpaces account, sign in and go straight to your dashboard. If you are new, create a doctor account to start browsing consultation spaces."
      accentClassName="from-primary-700 via-primary-800 to-slate-950"
      choices={[
        {
          label: 'Already have an account?',
          description: 'Sign in to continue where you left off, access your doctor dashboard, and manage inquiries.',
          href: '/login?redirect=/doctor/dashboard',
          buttonLabel: 'Sign In',
          icon: LogIn,
          variant: 'outline',
        },
        {
          label: 'New to MedSpaces?',
          description: 'Create a doctor account to browse verified spaces, save time, and start connecting with clinics.',
          href: '/register?role=DOCTOR',
          buttonLabel: 'Create Doctor Account',
          icon: UserPlus,
        },
      ]}
    />
  );
}
