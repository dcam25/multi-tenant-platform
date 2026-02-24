import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Direction = "ltr" | "rtl";

interface ThemeState {
  direction: Direction;
  customBackground: string;
  setDirection: (dir: Direction) => void;
  setCustomBg: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      direction: "ltr",
      customBackground: "hsl(0 0% 100%)",
      setDirection: (direction) => {
        set({ direction });
        if (typeof document !== "undefined") {
          document.documentElement.dir = direction;
        }
      },
      setCustomBg: (customBackground) => {
        set({ customBackground });
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty(
            "--custom-bg",
            customBackground
          );
        }
      },
    }),
    { name: "theme-settings" }
  )
);
