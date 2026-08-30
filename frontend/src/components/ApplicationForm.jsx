import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ApplicationForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    applied_date: new Date().toISOString().split("T")[0],
    status: "Applied",
    priority: "Medium",
    notes: "",
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          company: "",
          position: "",
          location: "",
          applied_date: new Date().toISOString().split("T")[0],
          status: "Applied",
          priority: "Medium",
          notes: "",
        });
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [initialData, isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out p-4 ${
        isOpen ? "opacity-100 bg-slate-900/60 backdrop-blur-sm" : "opacity-0 pointer-events-none"
      }`}
    >
      <div 
        className={`w-full max-w-lg rounded-2xl bg-card border border-border/60 p-6 md:p-8 shadow-2xl transition-all duration-300 ease-out ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              {initialData ? "Edit Application" : "Add Application"}
            </h2>
            <p className="text-sm font-medium text-text-secondary mt-1">
              {initialData ? "Update the details of your application." : "Keep track of a new opportunity."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Company</label>
              <input
                required
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
                placeholder="Google"
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Position</label>
              <input
                required
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Location</label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Date Applied</label>
              <input
                required
                type="date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
              >
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm resize-none"
              placeholder="Any additional details..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium hover:bg-primary-hover active:scale-95"
            >
              {initialData ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
