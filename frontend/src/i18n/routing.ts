import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "es", "zh", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});
