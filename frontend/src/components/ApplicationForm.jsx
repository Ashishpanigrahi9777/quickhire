import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

export default function ApplicationForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    applied_date: new Date().toISOString().split("T")[0],
    status: "Applied",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        company: "",
        position: "",
        location: "",
        applied_date: new Date().toISOString().split("T")[0],
        status: "Applied",
        notes: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {initialData ? "Edit Application" : "Add Application"}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {initialData ? "Update the details of your application." : "Keep track of a new opportunity."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-text-primary">Company</label>
              <input
                required
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Google"
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-text-primary">Position</label>
              <input
                required
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-text-primary">Location</label>
              <input
                required
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-text-primary">Date Applied</label>
              <input
                required
                type="date"
                name="applied_date"
                value={formData.applied_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Any additional details..."
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover hover:-translate-y-px hover:shadow active:scale-95"
            >
              {initialData ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
