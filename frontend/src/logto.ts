import { UserScope, ReservedResource } from "@logto/next";
import type { LogtoNextConfig } from "@logto/next";

export const logtoConfig: LogtoNextConfig = {
  appId: process.env.LOGTO_APP_ID ?? "",
  appSecret: process.env.LOGTO_APP_SECRET ?? "",
  endpoint: process.env.LOGTO_ENDPOINT ?? "",
  baseUrl:
    (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    ),
  cookieSecret:
    process.env.LOGTO_COOKIE_SECRET ||
    "complex_password_at_least_32_characters_long_for_development",
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: [UserScope.Organizations, UserScope.Email],
  resources: [ReservedResource.Organization],
};
