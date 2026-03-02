import { signIn } from "@logto/next/server-actions";
import { logtoConfig } from "@/logto";

export async function GET() {
  if (!logtoConfig.endpoint) {
    return new Response(
      "Logto not configured. Add LOGTO_ENDPOINT, LOGTO_APP_ID, LOGTO_APP_SECRET to .env",
      { status: 503, headers: { "Content-Type": "text/plain" } }
    );
  }
  await signIn(logtoConfig, {
    redirectUri: `${logtoConfig.baseUrl}/callback`,
    firstScreen: "register",
  });
}
