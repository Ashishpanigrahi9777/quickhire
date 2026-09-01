import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isOpen ? "opacity-100 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm" : "opacity-0 pointer-events-none"
      }`}
    >
      <div 
        className={`w-full max-w-sm rounded-3xl bg-card dark:bg-slate-800 p-6 md:p-8 shadow-2xl border border-border dark:border-border/70 transition-all duration-300 ease-out ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 mb-4 ring-8 ring-red-50/50 dark:ring-red-500/10">
            <AlertTriangle size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary mb-2">{title}</h2>
          <p className="text-sm font-medium text-text-secondary">{message}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-600 dark:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 dark:hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-premium active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
