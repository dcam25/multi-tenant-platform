import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/logto";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { isAuthenticated } = await getLogtoContext(logtoConfig);
  const { locale } = await params;
  const t = await getTranslations("Home");

  return (
    <div className="p-8">
      {isAuthenticated ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{t("welcomeTitle")}</h1>
          <p className="text-muted-foreground">{t("welcomeDescription")}</p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">{t("guestTitle")}</h1>
          <p className="text-muted-foreground mb-4">{t("guestDescription")}</p>
          <div className="flex gap-2">
            <Link
              href={`/${locale}/sign-in`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("signIn")}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
            >
              {t("dashboard")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
