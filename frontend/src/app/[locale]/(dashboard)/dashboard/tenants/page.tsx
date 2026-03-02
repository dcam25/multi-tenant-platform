import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export default async function TenantsPage() {
  const t = await getTranslations("Dashboard");
  return (
    <div className="p-6 md:p-8">
      <PageHeader
        title={t("tenantsTitle")}
        description={t("tenantsDescription")}
      />
    </div>
  );
}
