export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl border border-border bg-gray-50/50 p-6">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-6 w-3/4 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-96 rounded-xl border border-border bg-gray-50/50 p-6">
        <div className="mb-6 h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
