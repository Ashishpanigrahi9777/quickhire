import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 backdrop-blur-xl shadow-glass transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50/50 dark:bg-slate-800/50 text-text-muted text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Company</th>
              <th className="px-6 py-4 font-semibold">Position</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Applied Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="group transition-all duration-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.2)] relative"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-text-primary">{app.company}</span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{app.position}</td>
                <td className="px-6 py-4 text-text-secondary">{app.location}</td>
                <td className="px-6 py-4 text-text-secondary">
                  {format(new Date(app.applied_date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset shadow-sm ${
                    app.priority === 'High' ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20' :
                    app.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20' :
                    'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20'
                  }`}>
                    <svg className={`h-1.5 w-1.5 ${
                      app.priority === 'High' ? 'fill-red-500 dark:fill-red-400' :
                      app.priority === 'Medium' ? 'fill-amber-500 dark:fill-amber-400' :
                      'fill-slate-500 dark:fill-slate-400'
                    }`} viewBox="0 0 6 6" aria-hidden="true">
                      <circle cx="3" cy="3" r="3" />
                    </svg>
                    {app.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link
                      to={`/applications/${app.id}`}
                      className="rounded-md p-2 text-text-muted hover:bg-primary/5 hover:text-primary transition-all hover:scale-105 active:scale-95"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => onEdit(app)}
                      className="rounded-md p-2 text-text-muted hover:bg-amber-50 hover:text-amber-600 transition-all hover:scale-105 active:scale-95"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(app)}
                      className="rounded-md p-2 text-text-muted hover:bg-red-50 hover:text-red-600 transition-all hover:scale-105 active:scale-95"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
