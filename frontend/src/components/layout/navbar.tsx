"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/stores/settings-store";
import { TenantSwitcher } from "@/components/tenant/tenant-switcher";
import { NotificationDropdown } from "@/components/layout/notification-dropdown";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const dropdownVariants = {
  closed: { opacity: 0, y: -8, scale: 0.96 },
  open: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
};

interface NavbarProps {
  user: { id?: string; name?: string; email?: string; picture?: string } | null;
  isSignedIn: boolean;
  onSignOut: () => Promise<void>;
}

export function Navbar({ user, isSignedIn, onSignOut }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Nav");
  const tTheme = useTranslations("Theme");
  const tCommon = useTranslations("Common");

  const basePath = `/${locale}`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        themeRef.current &&
        !themeRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
        setThemeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setProfileOpen(false);
    setThemeOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link href={basePath} className="flex-shrink-0 font-semibold">
            Multi-Tenant
          </Link>
          <Breadcrumb />
        </div>

        <nav className="flex items-center gap-2 flex-shrink-0">
          {isSignedIn && <TenantSwitcher />}
          <Link
            href={basePath}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === basePath ? "bg-accent text-accent-foreground" : "hover:bg-accent"
            }`}
          >
            Home
          </Link>
          <Link
            href={`${basePath}/dashboard`}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname?.includes("/dashboard") ? "bg-accent text-accent-foreground" : "hover:bg-accent"
            }`}
          >
            Dashboard
          </Link>

          {/* Notifications */}
          {isSignedIn && <NotificationDropdown />}

          {/* Locale switcher */}
          <LocaleSwitcher />

          {/* Theme toggle */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => {
                setThemeOpen(!themeOpen);
                setProfileOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Theme"
            >
              {!mounted ? (
                <span className="w-5 h-5 block" />
              ) : resolvedTheme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>
            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 py-2 rounded-lg border border-border bg-popover shadow-lg"
                >
                  {(["light", "dark", "system"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setTheme(mode);
                        setThemeOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-accent ${
                        theme === mode ? "bg-accent font-medium" : ""
                      }`}
                    >
                      {tTheme(mode)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings (gear) */}
          <button
            onClick={() => useSettingsStore.getState().openSidebar()}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={t("settings")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Profile dropdown */}
          {isSignedIn && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setThemeOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-accent transition-colors"
              >
                <img
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "U")}`}
                  alt={user.name || "Avatar"}
                  className="h-8 w-8 rounded-full"
                />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="exit"
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 py-2 rounded-lg border border-border bg-popover shadow-lg"
                  >
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium truncate">
                        {user.name || user.email || tCommon("user")}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <hr className="border-border my-2" />
                    <Link
                      href={`${basePath}/profile`}
                      onClick={closeAll}
                      className="block px-4 py-2 text-sm hover:bg-accent"
                    >
                      {t("profile")}
                    </Link>
                    <button
                      onClick={() => {
                        useSettingsStore.getState().openSidebar();
                        closeAll();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                    >
                      {t("settings")}
                    </button>
                    <hr className="border-border my-2" />
                    <button
                      onClick={() => onSignOut()}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-destructive"
                    >
                      {t("signOut")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isSignedIn && (
            <Link
              href={`/${locale}/sign-in`}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("signIn")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
