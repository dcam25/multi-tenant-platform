"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer");
  const basePath = `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background flex-shrink-0 mt-auto">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year })}
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href={basePath}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              href={`${basePath}/dashboard`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("dashboard")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
