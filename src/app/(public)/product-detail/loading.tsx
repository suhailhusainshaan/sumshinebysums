export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 bg-card shadow-warm lg:h-18" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-1/4 rounded bg-muted" />
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-square rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-8 w-1/3 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
              <div className="h-14 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
