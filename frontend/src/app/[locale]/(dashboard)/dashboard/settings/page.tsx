import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export default async function SettingsPage() {
  const t = await getTranslations("Dashboard");
  return (
    <div className="p-6 md:p-8">
      <PageHeader
        title={t("settingsTitle")}
        description={t("settingsDescription")}
      />
    </div>
  );
}
