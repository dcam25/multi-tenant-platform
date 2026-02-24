/**
 * RESTful API client for backend
 * Documented endpoints: /api/v1/*
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options ?? {};
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init?.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? res.statusText);
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
    list: (page = 1, pageSize = 20) =>
      apiFetch<{ users: unknown[]; total: number }>(
        `/users?page=${page}&page_size=${pageSize}`
      ),
    get: (id: string) => apiFetch(`/users/${id}`),
  },
  tenants: {
    list: () => apiFetch<{ tenants: unknown[]; total: number }>("/tenants"),
    get: (id: string) => apiFetch(`/tenants/${id}`),
  },
  notifications: {
    list: () => apiFetch<{ notifications: unknown[] }>("/notifications"),
  },
};
