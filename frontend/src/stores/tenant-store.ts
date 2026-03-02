import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tenant } from "@/lib/tenant-config";

interface TenantState {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  setCurrentTenant: (tenant: Tenant | null) => void;
  setTenants: (tenants: Tenant[]) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentTenant: null,
      tenants: [],
      setCurrentTenant: (currentTenant) => set({ currentTenant }),
      setTenants: (tenants) => set({ tenants }),
    }),
    { name: "tenant-store" }
  )
);
