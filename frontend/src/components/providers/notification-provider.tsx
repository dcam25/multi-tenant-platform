"use client";

import { useUser } from "@clerk/nextjs";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  useNotifications(user?.id);

  return <>{children}</>;
}
