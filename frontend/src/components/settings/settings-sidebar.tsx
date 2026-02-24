"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslations } from "next-intl";

const THEME_COLORS = [
  { name: "Default", value: "hsl(0 0% 100%)", dark: "hsl(222.2 84% 4.9%)" },
  { name: "Warm", value: "hsl(40 20% 98%)", dark: "hsl(220 20% 6%)" },
  { name: "Cool", value: "hsl(210 20% 98%)", dark: "hsl(220 25% 5%)" },
  { name: "Green", value: "hsl(140 20% 98%)", dark: "hsl(140 20% 6%)" },
];

export function SettingsSidebar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { direction, setDirection, setCustomBg } = useThemeStore();
  const t = useTranslations("Settings");
  const isDark = resolvedTheme === "dark";

  const handleBgChange = (color: string, darkColor: string) => {
    setCustomBg(isDark ? darkColor : color);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
        aria-label={t("open")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-full bg-background border-l border-border shadow-xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">{t("title")}</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg"
                >
                  ×
                </button>
              </div>

              <section className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("theme")}
                </h3>
                <div className="flex gap-2">
                  {(["light", "dark", "system"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTheme(mode)}
                      className={`px-3 py-2 rounded-lg text-sm capitalize ${
                        theme === mode
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-accent"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-4 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("direction")}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDirection("ltr")}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      direction === "ltr"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-accent"
                    }`}
                  >
                    LTR
                  </button>
                  <button
                    onClick={() => setDirection("rtl")}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      direction === "rtl"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-accent"
                    }`}
                  >
                    RTL
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("background")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {THEME_COLORS.map(({ name, value, dark }) => (
                    <button
                      key={name}
                      onClick={() => handleBgChange(value, dark)}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: isDark ? dark : value,
                      }}
                      title={name}
                    />
                  ))}
                </div>
              </section>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
