export default function NotFound() {
  return (
    <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-card p-8 ring-1 ring-white/10">
      <h1 className="text-2xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-white/70">
        This city pair isn’t available (yet). Try the main tool to pick cities from the built-in list.
      </p>
      <a
        href="/"
        className="mt-6 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
      >
        Go to the tool
      </a>
    </div>
  );
}
