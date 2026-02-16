export default function Loading() {
  return (
    <div className="mt-10 animate-pulse rounded-2xl bg-card p-6 ring-1 ring-white/10">
      <div className="h-6 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-4 w-1/2 rounded bg-white/10" />
      <div className="mt-6 h-40 rounded bg-white/5" />
    </div>
  );
}
