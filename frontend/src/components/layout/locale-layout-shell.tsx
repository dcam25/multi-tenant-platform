"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { NotificationProvider } from "@/components/providers/notification-provider";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface LocaleLayoutShellProps {
  children: React.ReactNode;
  user: AuthUser | null;
  isSignedIn: boolean;
  onSignOut: () => Promise<void>;
  getToken: (resource?: string, organizationId?: string) => Promise<string>;
}

export function LocaleLayoutShell({
  children,
  user,
  isSignedIn,
  onSignOut,
  getToken,
}: LocaleLayoutShellProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.includes("/sign-in") || pathname?.includes("/sign-up");

  return (
    <AuthProvider getToken={getToken}>
      <NotificationProvider userId={user?.id}>
      <div className="min-h-screen flex flex-col">
        <Navbar
          user={user}
          isSignedIn={isSignedIn}
          onSignOut={onSignOut}
        />
        <TenantProvider getToken={getToken} isSignedIn={isSignedIn} user={user}>
          <div className="flex flex-1 min-h-0">
            {!isAuthPage && <AppSidebar />}
            <main className="flex-1 min-w-0 min-h-0 overflow-auto flex flex-col">
              {children}
            </main>
          </div>
        </TenantProvider>
        <Footer />
      </div>
      </NotificationProvider>
    </AuthProvider>
  );
}
