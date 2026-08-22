import { cn } from "../utils/cn";

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
  Assessment: "bg-amber-50 text-amber-700 border-amber-200",
  Interview: "bg-purple-50 text-purple-700 border-purple-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {status}
    </span>
  );
}
