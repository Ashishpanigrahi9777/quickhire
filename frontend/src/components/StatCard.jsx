import { cn } from "../utils/cn";

export default function StatCard({ title, value, icon: Icon, trend, index = 0 }) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-premium animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
    >
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 dark:group-hover:opacity-20" />
      
      <div className="relative flex items-start gap-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-3 text-primary dark:text-white shadow-inner ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-110">
          <Icon size={24} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-text-primary">{value}</h3>
            {trend && (
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
