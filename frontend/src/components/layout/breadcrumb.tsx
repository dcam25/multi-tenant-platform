"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const BREADCRUMB_KEYS: Record<string, string> = {
  dashboard: "overview",
  users: "users",
  tenants: "tenants",
  analytics: "analytics",
  settings: "settings",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Breadcrumb");

  const segments = pathname?.split("/").filter(Boolean) ?? [];
  if (segments.length < 2) return null;

  const [, ...rest] = segments;
  if (rest[0] !== "dashboard") return null;

  const items: { href: string; label: string }[] = [];
  let href = `/${locale}`;
  for (let i = 0; i < rest.length; i++) {
    const seg = rest[i];
    href += `/${seg}`;
    const key = BREADCRUMB_KEYS[seg];
    items.push({ href, label: key ? t(key) : seg });
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={item.href} className="flex items-center gap-2">
          {i > 0 && (
            <span className="text-muted-foreground/60" aria-hidden>
              /
            </span>
          )}
          {i === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
