import { cn } from "../utils/cn";

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  Assessment: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  Interview: "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20",
  Selected: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset shadow-sm transition-colors",
        statusStyles[status] || "bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20"
      )}
    >
      {/* Optional tiny dot indicator */}
      <svg className={cn("mr-1.5 h-1.5 w-1.5", 
        status === 'Applied' ? 'fill-blue-500' :
        status === 'Assessment' ? 'fill-amber-500' :
        status === 'Interview' ? 'fill-purple-500' :
        status === 'Selected' ? 'fill-emerald-500' :
        status === 'Rejected' ? 'fill-red-500' : 'fill-slate-500'
      )} viewBox="0 0 6 6" aria-hidden="true">
        <circle cx="3" cy="3" r="3" />
      </svg>
      {status}
    </span>
  );
}
