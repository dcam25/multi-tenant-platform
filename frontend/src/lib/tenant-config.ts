/**
 * Tenant configuration types
 * Per article: tenant-specific customizations, branding, feature access
 */

export interface TenantBranding {
  logo?: string;
  primaryColor?: string;
  favicon?: string;
}

export interface TenantFeatures {
  [key: string]: boolean;
}

export type Role = "admin" | "manager" | "member" | "viewer";

export interface TenantConfig {
  branding?: TenantBranding;
  features?: TenantFeatures;
  settings?: Record<string, unknown>;
  role?: Role;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  config?: TenantConfig;
}
