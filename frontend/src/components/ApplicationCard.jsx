import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

export default function ApplicationCard({ app, onEdit, onDelete }) {
  return (
    <div className="group rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-premium relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-5 dark:group-hover:opacity-10" />
      
      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-text-primary">{app.company}</h3>
          <p className="text-sm font-medium text-text-secondary">{app.position}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      
      <div className="relative mb-5 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-text-muted text-xs uppercase tracking-wider">Location</span>
          <span className="text-text-primary">{app.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-text-muted text-xs uppercase tracking-wider">Applied</span>
          <span className="text-text-primary">{format(new Date(app.applied_date), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 font-medium text-text-muted text-xs uppercase tracking-wider">Priority</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ring-inset shadow-sm ${
            app.priority === 'High' ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20' :
            app.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20' :
            'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20'
          }`}>
            <svg className={`h-1.5 w-1.5 ${
              app.priority === 'High' ? 'fill-red-500 dark:fill-red-400' :
              app.priority === 'Medium' ? 'fill-amber-500 dark:fill-amber-400' :
              'fill-slate-500 dark:fill-slate-400'
            }`} viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
            {app.priority}
          </span>
        </div>
      </div>
      
      <div className="relative flex items-center justify-end gap-2 border-t border-border/50 pt-4">
        <Link
          to={`/applications/${app.id}`}
          className="rounded-lg p-2 text-text-muted hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Eye size={18} />
        </Link>
        <button
          onClick={() => onEdit(app)}
          className="rounded-lg p-2 text-text-muted hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(app)}
          className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
