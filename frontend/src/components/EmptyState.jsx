import { Briefcase, Plus } from "lucide-react";

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
        <Briefcase size={32} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-text-primary">No applications yet</h3>
      <p className="mb-6 max-w-sm text-sm text-text-secondary">
        Start tracking your job search by adding your first application. Keep everything organized in one place.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover hover:-translate-y-px hover:shadow active:scale-95"
      >
        <Plus size={18} />
        Add Application
      </button>
    </div>
  );
}
