import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

export default function ApplicationCard({ app, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-medium text-text-primary">{app.company}</h3>
          <p className="text-sm text-text-secondary">{app.position}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <div className="mb-4 space-y-1 text-sm text-text-secondary">
        <p>{app.location}</p>
        <p>Applied: {format(new Date(app.applied_date), "MMM d, yyyy")}</p>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
        <Link
          to={`/applications/${app.id}`}
          className="rounded p-2 text-text-secondary hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          <Eye size={18} />
        </Link>
        <button
          onClick={() => onEdit(app)}
          className="rounded p-2 text-text-secondary hover:bg-amber-50 hover:text-amber-600 transition-colors"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(app)}
          className="rounded p-2 text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
