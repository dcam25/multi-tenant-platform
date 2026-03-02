import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardContent } from "./dashboard-content";
import { DashboardStatsSkeleton } from "./dashboard-stats-skeleton";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  return (
    <div className="p-6 md:p-8">
      <PageHeader title={t("overviewTitle")} description={t("overviewDescription")} />
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
