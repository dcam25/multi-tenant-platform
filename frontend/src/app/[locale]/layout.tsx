import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getLogtoContext, signOut } from "@logto/next/server-actions";
import { getApiToken } from "@/lib/logto-actions";
import { routing } from "@/i18n/routing";
import { logtoConfig } from "@/logto";
import { LocaleLayoutShell } from "@/components/layout/locale-layout-shell";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const { isAuthenticated, claims, userInfo } = await getLogtoContext(
    logtoConfig,
    { fetchUserInfo: true }
  );

  const user = userInfo
    ? {
        id: claims?.sub,
        name: userInfo.name ?? userInfo.username ?? undefined,
        email: userInfo.email ?? undefined,
        picture: userInfo.picture ?? undefined,
      }
    : null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SettingsSidebar hideTrigger />
      <LocaleLayoutShell
        user={user}
        isSignedIn={isAuthenticated}
        onSignOut={async () => {
          "use server";
          await signOut(logtoConfig, `${logtoConfig.baseUrl}`);
        }}
        getToken={getApiToken}
      >
        {children}
      </LocaleLayoutShell>
    </NextIntlClientProvider>
  );
}
