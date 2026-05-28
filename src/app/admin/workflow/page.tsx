"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Workflow } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

export default function AdminWorkflowPage() {
  const router = useRouter();

  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <div className="section-padding py-10">
        <div className="max-w-4xl space-y-6">
          <Badge variant="info">
            <Workflow className="mr-2 h-3.5 w-3.5" /> Workflow management
          </Badge>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Moderation workflow</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review pending listings and doctor profiles, then jump back to the admin workspace to apply approvals, rejections, or verification changes.
            </p>
          </div>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Workflow controls live in the admin dashboard</h2>
                <p className="text-sm leading-6 text-gray-500">
                  This page exists so the navigation target is real and bookmarkable. The moderation tables and inquiry workflow modal remain in the main admin console.
                </p>
                <Button onClick={() => router.push('/admin#workflow')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Open workflow panel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
