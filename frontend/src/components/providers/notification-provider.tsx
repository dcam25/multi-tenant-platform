"use client";

import { useNotifications } from "@/hooks/use-notifications";

export function NotificationProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  useNotifications(userId);

  return <>{children}</>;
}
