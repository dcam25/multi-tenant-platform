import { Suspense } from "react";
import { DashboardContent } from "./dashboard-content";
import { DashboardStatsSkeleton } from "./dashboard-stats-skeleton";

/**
 * Dashboard with partial loading:
 * - Full page: loading.tsx handles route transition
 * - Partial: Suspense for stats section
 */
export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
