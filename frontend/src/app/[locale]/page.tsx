import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-8">
        {userId ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the multi-tenant platform.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Multi-Tenant Platform</h1>
            <p className="text-muted-foreground mb-4">
              Sign in to access the dashboard.
            </p>
            <div className="flex gap-2">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
