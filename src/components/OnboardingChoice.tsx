import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Badge, Card } from '@/components/ui';

type Choice = {
  label: string;
  description: string;
  href: string;
  buttonLabel: string;
  icon: LucideIcon;
  variant?: 'primary' | 'outline';
};

interface OnboardingChoiceProps {
  title: string;
  subtitle: string;
  badge: string;
  accentClassName: string;
  choices: [Choice, Choice];
}

export default function OnboardingChoice({ title, subtitle, badge, accentClassName, choices }: OnboardingChoiceProps) {
  return (
    <section className={`min-h-[calc(100vh-5rem)] bg-gradient-to-br ${accentClassName} px-4 py-12 text-white`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
            {badge}
          </Badge>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-white/85">{subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {choices.map((choice) => (
            <Card key={choice.label} className="border-white/15 bg-white/95 text-gray-900 shadow-2xl shadow-slate-950/20 backdrop-blur-sm">
              <div className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                    <choice.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">{choice.label}</p>
                  </div>
                </div>

                <p className="mt-4 text-base leading-7 text-gray-600">{choice.description}</p>

                <div className="mt-6">
                  {choice.variant === 'outline' ? (
                       <Link href={choice.href} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white/90 px-4 py-3 font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                      <choice.icon className="h-4 w-4" />
                      {choice.buttonLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                       <Link href={choice.href} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600/90 px-4 py-3 font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700">
                        <choice.icon className="h-4 w-4" />
                        {choice.buttonLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}