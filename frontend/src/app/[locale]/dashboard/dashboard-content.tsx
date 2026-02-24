"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchStats() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function DashboardContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) return <DashboardStatsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Status</p>
        <p className="text-2xl font-bold">{data?.status ?? "—"}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Redis</p>
        <p className="text-2xl font-bold">{data?.redis ?? "—"}</p>
      </div>
    </motion.div>
  );
}
