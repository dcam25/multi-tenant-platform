"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/stores/theme-store";

function ThemeSync() {
  const { resolvedTheme } = useTheme();
  const { customBackgroundLight, customBackgroundDark, direction } = useThemeStore();

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    const bg = isDark ? customBackgroundDark : customBackgroundLight;
    document.documentElement.style.setProperty("--custom-bg", bg);
  }, [customBackgroundLight, customBackgroundDark, resolvedTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
