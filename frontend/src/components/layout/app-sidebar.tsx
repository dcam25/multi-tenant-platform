"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/theme-store";
import { useTenantStore } from "@/stores/tenant-store";
import { useSettingsStore } from "@/stores/settings-store";
import { ROLE_NAV } from "@/lib/roles";
import { NavIconSvg } from "@/components/icons/nav-icons";
import type { Role } from "@/lib/tenant-config";

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const { sidebarBackgroundLight, sidebarBackgroundDark } = useThemeStore();
  const { currentTenant } = useTenantStore();
  const { appSidebarCollapsed, toggleAppSidebar } = useSettingsStore();
  const t = useTranslations("Sidebar");

  useEffect(() => setMounted(true), []);

  const role: Role = currentTenant?.config?.role ?? "member";
  const navItems = ROLE_NAV[role] ?? ROLE_NAV.member;

  const sidebarBg = !mounted
    ? sidebarBackgroundLight
    : resolvedTheme === "dark"
      ? sidebarBackgroundDark
      : sidebarBackgroundLight;

  return (
    <aside
      className={`flex-shrink-0 border-r border-border flex flex-col self-stretch transition-all duration-300 ${
        appSidebarCollapsed ? "w-16" : "w-56"
      }`}
      style={{ backgroundColor: sidebarBg }}
    >
      {/* Header: logo + collapse toggle */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-border">
        {!appSidebarCollapsed && (
          <Link href={`/${locale}`} className="font-semibold text-sm truncate">
            Multi-Tenant
          </Link>
        )}
        <button
          onClick={toggleAppSidebar}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label={appSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${appSidebarCollapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <NavIconSvg icon={item.icon} />
                {!appSidebarCollapsed && <span>{t(item.labelKey)}</span>}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
