export default function ProductListingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 lg:h-18 bg-card shadow-warm" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-12 bg-muted rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-96 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
