export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[120px] rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/5 to-transparent"></div>
            <div className="flex gap-4 items-start">
              <div className="h-12 w-12 rounded-xl bg-slate-200/50 dark:bg-slate-700/50"></div>
              <div className="flex-1 space-y-3 mt-1">
                <div className="h-3 w-1/2 rounded-full bg-slate-200/50 dark:bg-slate-700/50"></div>
                <div className="h-6 w-3/4 rounded-md bg-slate-200/50 dark:bg-slate-700/50"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[400px] rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/5 to-transparent"></div>
        <div className="mb-8 h-6 w-48 rounded-md bg-slate-200/50 dark:bg-slate-700/50"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-200/40 dark:bg-slate-700/40"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
