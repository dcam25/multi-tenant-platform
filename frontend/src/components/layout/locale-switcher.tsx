"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { routing } from "@/i18n/routing";

const dropdownVariants = {
  closed: { opacity: 0, y: -8, scale: 0.96 },
  open: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
};

export function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Locale");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/") || `/${newLocale}`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
        aria-label="Language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="uppercase">{locale}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 py-2 rounded-lg border border-border bg-popover shadow-lg"
          >
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={getLocalizedPath(loc)}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm hover:bg-accent ${
                  locale === loc ? "bg-accent font-medium" : ""
                }`}
              >
                {t(loc as "en" | "ar" | "es" | "zh" | "de")}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
