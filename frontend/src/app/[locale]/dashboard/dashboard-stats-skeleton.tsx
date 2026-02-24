export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-6 animate-pulse"
        >
          <div className="h-4 w-20 bg-muted rounded mb-4" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
