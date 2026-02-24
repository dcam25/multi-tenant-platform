import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Tenant Platform",
  description: "SaaS platform with RBAC, multi-tenant support",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <QueryProvider>
                <NotificationProvider>
                  <SettingsSidebar />
                  {children}
                  <Toaster />
                </NotificationProvider>
              </QueryProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
