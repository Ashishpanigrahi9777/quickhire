import { cn } from "../utils/cn";

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-primary-light p-3 text-primary">
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
            {trend && (
              <span className="text-xs font-medium text-green-600">
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
