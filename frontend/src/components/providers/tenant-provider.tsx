"use client";

import { useEffect } from "react";
import { useTenantStore } from "@/stores/tenant-store";
import { apiFetch } from "@/lib/api-client";
import type { AuthUser } from "@/components/layout/locale-layout-shell";

/**
 * Fetches tenant list for current user and sets tenant context
 * Uses Logto organizations or backend /tenants/me
 */
interface TenantProviderProps {
  children: React.ReactNode;
  getToken: (resource?: string, organizationId?: string) => Promise<string>;
  isSignedIn: boolean;
  user: AuthUser | null;
}

export function TenantProvider({
  children,
  getToken,
  isSignedIn,
  user,
}: TenantProviderProps) {
  const { setTenants, setCurrentTenant } = useTenantStore();

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      setTenants([]);
      setCurrentTenant(null);
      return;
    }

    async function fetchTenants() {
      try {
        const token = await getToken();
        const res = await apiFetch<{ tenants: unknown[]; total: number }>(
          "/tenants/me",
          { token }
        );
        const list = (res.tenants || []) as import("@/lib/tenant-config").Tenant[];
        setTenants(list);
        if (list.length > 0 && !useTenantStore.getState().currentTenant) {
          setCurrentTenant(list[0]);
        }
      } catch {
        setTenants([]);
      }
    }

    fetchTenants();
  }, [isSignedIn, user?.id, getToken]);

  return <>{children}</>;
}
