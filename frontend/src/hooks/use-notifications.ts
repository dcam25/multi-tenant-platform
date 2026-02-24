"use client";

import { useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/stores/notification-store";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

/**
 * Real-time notifications via Socket.io
 * Alternative: Server-Sent Events (SSE) for simpler one-way push
 * Socket.io preferred when bi-directional or room-based updates needed
 */
export function useNotifications(userId?: string) {
  const { addNotification } = useNotificationStore();

  const connect = useCallback(() => {
    if (!userId) return null;
    const socket: Socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ["websocket", "polling"],
    });

    socket.on("notification", (data: { type: string; title: string; message: string }) => {
      addNotification({
        id: crypto.randomUUID(),
        ...data,
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("connect_error", () => {
      console.warn("Notification socket connection failed");
    });

    return socket;
  }, [userId, addNotification]);

  useEffect(() => {
    const socket = connect();
    return () => {
      socket?.disconnect();
    };
  }, [connect]);
}
