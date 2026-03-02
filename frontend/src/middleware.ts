import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import LogtoClient from "@logto/next/edge";
import { routing } from "./i18n/routing";
import { logtoConfig } from "./logto";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/callback",
  "/api/webhooks",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return true;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && routing.locales.includes(segments[0] as (typeof routing.locales)[number])) return true;
  return PUBLIC_PATHS.some((p) => pathname.includes(p));
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // OAuth callback must stay at /callback - no locale prefix (redirect_uri must match exactly)
  if (pathname === "/callback") {
    return NextResponse.next();
  }

  if (!isPublicPath(pathname)) {
    try {
      const logtoClient = new LogtoClient(logtoConfig);
      const context = await logtoClient.getLogtoContext(request);
      if (!context.isAuthenticated) {
        const locale = pathname.split("/")[1] || routing.defaultLocale;
        const signInUrl = new URL(`/${locale}/sign-in`, request.url);
        return NextResponse.redirect(signInUrl);
      }
    } catch {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
