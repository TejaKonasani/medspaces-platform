import { Card, Skeleton, SkeletonTableRows } from '@/components/ui';

export default function DoctorDashboardLoading() {
  return (
    <div className="page-shell min-h-screen bg-slate-50/80">
      <div className="section-padding py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-4 h-10 w-3/4" />
              <Skeleton className="mt-3 h-5 w-full" />
              <Skeleton className="mt-2 h-5 w-5/6" />
            </Card>
            <SkeletonTableRows rows={4} columns={3} />
          </div>
          <div className="space-y-6">
            <SkeletonTableRows rows={3} columns={1} />
            <SkeletonTableRows rows={2} columns={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
