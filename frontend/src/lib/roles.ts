/**
 * RBAC roles - matches backend
 */
export type Role = "admin" | "manager" | "member" | "viewer";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  member: "Member",
  viewer: "Viewer",
};

export type NavIcon = "layout-dashboard" | "users" | "building" | "chart" | "settings";

export const ROLE_NAV: Record<Role, { href: string; labelKey: string; icon: NavIcon }[]> = {
  admin: [
    { href: "/dashboard", labelKey: "overview", icon: "layout-dashboard" },
    { href: "/dashboard/users", labelKey: "users", icon: "users" },
    { href: "/dashboard/tenants", labelKey: "tenants", icon: "building" },
    { href: "/dashboard/analytics", labelKey: "analytics", icon: "chart" },
    { href: "/dashboard/settings", labelKey: "settings", icon: "settings" },
  ],
  manager: [
    { href: "/dashboard", labelKey: "overview", icon: "layout-dashboard" },
    { href: "/dashboard/users", labelKey: "users", icon: "users" },
    { href: "/dashboard/analytics", labelKey: "analytics", icon: "chart" },
    { href: "/dashboard/settings", labelKey: "settings", icon: "settings" },
  ],
  member: [
    { href: "/dashboard", labelKey: "overview", icon: "layout-dashboard" },
    { href: "/dashboard/settings", labelKey: "settings", icon: "settings" },
  ],
  viewer: [
    { href: "/dashboard", labelKey: "overview", icon: "layout-dashboard" },
  ],
};
