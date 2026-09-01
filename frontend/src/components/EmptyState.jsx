import { Briefcase, Plus } from "lucide-react";

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 dark:border-border/50 bg-card/50 dark:bg-slate-800/50 backdrop-blur-sm py-24 text-center transition-all duration-300 hover:bg-card/70 dark:hover:bg-slate-800/70">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-slate-700/20 blur-xl"></div>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-card to-card/50 dark:from-slate-700 dark:to-slate-800 border border-border/50 dark:border-border/40 shadow-sm rotate-3 transition-transform hover:rotate-6 duration-300">
          <Briefcase size={36} className="text-primary dark:text-slate-400 opacity-80" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="mb-2 text-2xl font-bold tracking-tight text-text-primary">No applications yet</h3>
      <p className="mb-8 max-w-sm text-sm font-medium text-text-secondary leading-relaxed">
        Start tracking your job search by adding your first application. Keep everything organized in one place.
      </p>
      <button
        onClick={onAdd}
        className="group inline-flex items-center gap-2 rounded-xl bg-primary dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium hover:bg-primary-hover dark:hover:bg-slate-600 active:scale-95"
      >
        <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
        Add Application
      </button>
    </div>
  );
}
