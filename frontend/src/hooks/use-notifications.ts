"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/stores/notification-store";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

// Single socket per userId - prevents duplicate connections from re-renders/Strict Mode
const socketCache = new Map<string, Socket>();

/**
 * Real-time notifications via Socket.io
 * Uses a single shared socket per user to avoid duplicate connections.
 */
export function useNotifications(userId?: string) {
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Disconnect when user signs out or switches user
    if (!userId) {
      const prev = prevUserIdRef.current;
      if (prev) {
        socketCache.get(prev)?.disconnect();
        socketCache.delete(prev);
        prevUserIdRef.current = undefined;
      }
      return;
    }

    // Disconnect previous user's socket when switching accounts
    const prev = prevUserIdRef.current;
    if (prev && prev !== userId) {
      socketCache.get(prev)?.disconnect();
      socketCache.delete(prev);
    }

    // Reuse existing socket for this user
    let socket = socketCache.get(userId);
    if (!socket) {
      socket = io(SOCKET_URL, {
        path: "/socket.io",
        auth: { userId },
        transports: ["websocket"],
      });
      socketCache.set(userId, socket);

      socket.on("notification", (data: { type: string; title: string; message: string }) => {
        useNotificationStore.getState().addNotification({
          id: crypto.randomUUID(),
          ...data,
          read: false,
          createdAt: new Date().toISOString(),
        });
      });

      socket.on("connect_error", () => {
        console.warn("Notification socket connection failed");
      });
    }

    prevUserIdRef.current = userId;

    return () => {
      // Don't disconnect on unmount - allow Strict Mode remount to reuse
      // Socket is cleaned up when userId becomes undefined
    };
  }, [userId]);
}
