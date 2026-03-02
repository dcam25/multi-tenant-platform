import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Direction = "ltr" | "rtl";

const LIGHT_DEFAULT = "hsl(0 0% 100%)";
const DARK_DEFAULT = "hsl(222.2 84% 4.9%)";

const SIDEBAR_LIGHT = "hsl(210 40% 98%)";
const SIDEBAR_DARK = "hsl(217.2 32.6% 17.5%)";

interface ThemeState {
  direction: Direction;
  customBackgroundLight: string;
  customBackgroundDark: string;
  sidebarBackgroundLight: string;
  sidebarBackgroundDark: string;
  setDirection: (dir: Direction) => void;
  setCustomBgLight: (color: string) => void;
  setCustomBgDark: (color: string) => void;
  setCustomBg: (light: string, dark: string) => void;
  setSidebarBg: (light: string, dark: string) => void;
}

const migrateThemeStore = (state: unknown) => {
  const s = state as Record<string, unknown>;
  let next = { ...s };
  if (s?.customBackground && !s?.customBackgroundLight) {
    next = { ...next, customBackgroundLight: s.customBackground, customBackgroundDark: DARK_DEFAULT };
  }
  if (!s?.sidebarBackgroundLight) {
    next = { ...next, sidebarBackgroundLight: SIDEBAR_LIGHT, sidebarBackgroundDark: SIDEBAR_DARK };
  }
  return next;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      direction: "ltr",
      customBackgroundLight: LIGHT_DEFAULT,
      customBackgroundDark: DARK_DEFAULT,
      sidebarBackgroundLight: SIDEBAR_LIGHT,
      sidebarBackgroundDark: SIDEBAR_DARK,
      setDirection: (direction) => {
        set({ direction });
        if (typeof document !== "undefined") {
          document.documentElement.dir = direction;
        }
      },
      setCustomBgLight: (customBackgroundLight) => set({ customBackgroundLight }),
      setCustomBgDark: (customBackgroundDark) => set({ customBackgroundDark }),
      setCustomBg: (light, dark) => set({ customBackgroundLight: light, customBackgroundDark: dark }),
      setSidebarBg: (light, dark) => set({ sidebarBackgroundLight: light, sidebarBackgroundDark: dark }),
    }),
    { name: "theme-settings", migrate: migrateThemeStore }
  )
);
