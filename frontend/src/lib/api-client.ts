/**
 * RESTful API client for backend
 * Documented endpoints: /api/v1/*
 * Multi-tenant: passes X-Tenant-ID or X-Tenant-Slug for tenant context
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

export interface ApiOptions {
  token?: string;
  tenantId?: string;
  tenantSlug?: string;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & ApiOptions
): Promise<T> {
  const { token, tenantId, tenantSlug, ...init } = options ?? {};
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  if (tenantId) {
    (headers as Record<string, string>)["X-Tenant-ID"] = tenantId;
  }
  if (tenantSlug) {
    (headers as Record<string, string>)["X-Tenant-Slug"] = tenantSlug;
  }
  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? res.statusText);
  }
  return res.json();
}

export const api = {
  auth: {
    validate: (token: string) =>
      apiFetch<{ valid: boolean }>("/auth/validate", {
        method: "POST",
        token,
      }),
  },
  users: {
    list: (page = 1, pageSize = 20, opts?: ApiOptions) =>
      apiFetch<{ users: unknown[]; total: number }>(
        `/users?page=${page}&page_size=${pageSize}`,
        opts
      ),
    get: (id: string, opts?: ApiOptions) => apiFetch(`/users/${id}`, opts),
  },
  tenants: {
    list: (opts?: ApiOptions) =>
      apiFetch<{ tenants: unknown[]; total: number }>("/tenants/me", opts),
    create: (data: { name: string; slug: string; plan?: string }, opts?: ApiOptions) =>
      apiFetch("/tenants", {
        method: "POST",
        body: JSON.stringify(data),
        ...opts,
      }),
    get: (id: string, opts?: ApiOptions) => apiFetch(`/tenants/${id}`, opts),
  },
  notifications: {
    list: (opts?: ApiOptions) =>
      apiFetch<{ notifications: unknown[] }>("/notifications", opts),
  },
};
