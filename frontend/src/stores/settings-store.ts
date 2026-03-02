import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  sidebarOpen: boolean;
  appSidebarCollapsed: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  toggleAppSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      appSidebarCollapsed: false,
      openSidebar: () => set({ sidebarOpen: true }),
      closeSidebar: () => set({ sidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleAppSidebar: () => set((s) => ({ appSidebarCollapsed: !s.appSidebarCollapsed })),
    }),
    { name: "app-settings" }
  )
);
