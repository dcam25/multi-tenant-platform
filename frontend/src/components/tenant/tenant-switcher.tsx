"use client";

import { useState, useRef, useEffect } from "react";
import { useTenantStore } from "@/stores/tenant-store";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function TenantSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currentTenant, tenants, setCurrentTenant } = useTenantStore();
  const locale = useLocale();
  const t = useTranslations("Tenant");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (tenants.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium"
      >
        <span className="w-2 h-2 rounded-full bg-primary" />
        {currentTenant?.name ?? tenants[0]?.name ?? "Select tenant"}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 py-2 rounded-lg border border-border bg-popover shadow-lg">
          {tenants.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setCurrentTenant(t);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
                currentTenant?.id === t.id ? "bg-accent font-medium" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              {t.name}
            </button>
          ))}
          <hr className="border-border my-2" />
          <Link
            href={`/${locale}/onboarding`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-accent text-muted-foreground"
          >
            {t("createOrganization")}
          </Link>
        </div>
      )}
    </div>
  );
}
