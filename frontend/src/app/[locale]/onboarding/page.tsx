"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthToken } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api-client";
import { useTenantStore } from "@/stores/tenant-store";
import type { Tenant } from "@/lib/tenant-config";

/**
 * Tenant onboarding - per article: account creation, tenant-specific configuration
 */
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  plan: z.enum(["free", "pro", "enterprise"]),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const getToken = useAuthToken();
  const { setTenants, setCurrentTenant, tenants } = useTenantStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: "free" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const tenant = (await apiFetch("/tenants", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      })) as Tenant;
      setTenants([...tenants, tenant]);
      setCurrentTenant(tenant);
      router.push(`/${locale}/dashboard`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Create organization</h1>
      <p className="text-muted-foreground mb-6">
        Set up your workspace to get started.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Organization name</label>
          <input
            {...register("name")}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="Acme Inc"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL-friendly)</label>
          <input
            {...register("slug")}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="acme-inc"
          />
          {errors.slug && (
            <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plan</label>
          <select
            {...register("plan")}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create organization"}
        </button>
      </form>
    </div>
  );
}
