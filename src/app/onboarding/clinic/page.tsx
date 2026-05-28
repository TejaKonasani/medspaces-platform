import { Building2, LogIn, UserPlus } from 'lucide-react';
import OnboardingChoice from '@/components/OnboardingChoice';

export default function ClinicOnboardingPage() {
  return (
    <OnboardingChoice
      badge="Clinic partner onboarding"
      title="How would you like to continue?"
      subtitle="Existing clinic partners can sign in to manage their listings. New partners can create a clinic account and start publishing spaces."
      accentClassName="from-secondary-600 via-secondary-700 to-slate-950"
      choices={[
        {
          label: 'Already registered?',
          description: 'Sign in to manage your clinic dashboard, update listings, and review new inquiries.',
          href: '/login?redirect=/clinic/dashboard',
          buttonLabel: 'Sign In',
          icon: LogIn,
          variant: 'outline',
        },
        {
          label: 'New clinic partner?',
          description: 'Create a clinic account to list your consultation rooms and connect with verified doctors.',
          href: '/register?role=CLINIC_OWNER',
          buttonLabel: 'Create Clinic Account',
          icon: UserPlus,
        },
      ]}
    />
  );
}
