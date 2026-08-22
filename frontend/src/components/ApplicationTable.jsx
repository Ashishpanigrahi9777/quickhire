import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import StatusBadge from "./StatusBadge";

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-gray-50/50 text-text-secondary">
            <tr>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Position</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Applied Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="group transition-colors duration-200 hover:bg-slate-50/80"
              >
                <td className="px-6 py-4 font-medium text-text-primary">
                  {app.company}
                </td>
                <td className="px-6 py-4 text-text-secondary">{app.position}</td>
                <td className="px-6 py-4 text-text-secondary">{app.location}</td>
                <td className="px-6 py-4 text-text-secondary">
                  {format(new Date(app.applied_date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Link
                      to={`/applications/${app.id}`}
                      className="rounded p-1.5 text-text-secondary hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => onEdit(app)}
                      className="rounded p-1.5 text-text-secondary hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(app)}
                      className="rounded p-1.5 text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
