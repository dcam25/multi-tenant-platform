"use server";

import { getAccessToken, getOrganizationToken } from "@logto/next/server-actions";
import { logtoConfig } from "@/logto";

export async function getApiToken(resource?: string, organizationId?: string) {
  if (organizationId) {
    return getOrganizationToken(logtoConfig, organizationId);
  }
  return getAccessToken(logtoConfig, resource);
}
