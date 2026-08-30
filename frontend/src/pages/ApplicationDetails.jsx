import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase, FileText, AlertCircle, Clock, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { getApplication, updateApplication, deleteApplication, getApplicationHistory } from "../api/applications";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAppAndHistory = async () => {
    try {
      const [appData, historyData] = await Promise.all([
        getApplication(id),
        getApplicationHistory(id)
      ]);
      setApp(appData);
      setHistory(historyData);
    } catch (error) {
      toast.error("Application not found");
      navigate("/applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppAndHistory();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await updateApplication(id, data);
      toast.success("Application updated");
      setIsEditing(false);
      fetchAppAndHistory();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(id);
      toast.success("Application removed");
      navigate("/applications");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading || !app) {
    return (
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header title="Application Details" />
        <main className="flex-1 p-8 overflow-y-auto">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden animate-fade-in">
      <Header title="Application Details" />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        <div className="absolute -left-20 top-40 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute -right-20 top-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Applications
          </button>

          <div className="rounded-3xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 md:p-8 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">{app.company}</h1>
                <p className="text-xl font-medium text-text-secondary mb-5">{app.position}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={app.status} />
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest ring-1 ring-inset shadow-sm ${
                    app.priority === 'High' ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20' :
                    app.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20' :
                    'bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20'
                  }`}>
                    <svg className={`h-1.5 w-1.5 ${
                      app.priority === 'High' ? 'fill-red-500 dark:fill-red-400' :
                      app.priority === 'Medium' ? 'fill-amber-500 dark:fill-amber-400' :
                      'fill-slate-500 dark:fill-slate-400'
                    }`} viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                    {app.priority} Priority
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow transition-all duration-200 active:scale-95"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2.5 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 text-text-muted mb-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <MapPin size={18} />
                </div>
                <h3 className="font-semibold text-xs uppercase tracking-wider">Location</h3>
              </div>
              <p className="text-text-primary font-medium text-lg">{app.location}</p>
            </div>
            
            <div className="rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 text-text-muted mb-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <Calendar size={18} />
                </div>
                <h3 className="font-semibold text-xs uppercase tracking-wider">Applied Date</h3>
              </div>
              <p className="text-text-primary font-medium text-lg">{format(new Date(app.applied_date), "MMMM d, yyyy")}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3 text-text-muted mb-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  <AlertCircle size={18} />
                </div>
                <h3 className="font-semibold text-xs uppercase tracking-wider">Priority</h3>
              </div>
              <p className="text-text-primary font-medium text-lg">{app.priority}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 md:p-8 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3 text-text-secondary mb-6 border-b border-border/50 pb-4">
                <div className="p-2 rounded-lg bg-primary/5 dark:bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-primary tracking-tight">Notes</h2>
              </div>
              {app.notes ? (
                <p className="whitespace-pre-wrap text-text-secondary leading-relaxed text-sm">
                  {app.notes}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <FileText size={32} className="text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="text-text-muted italic text-sm">No notes provided for this application.</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 dark:bg-card/90 p-6 md:p-8 shadow-sm backdrop-blur-xl h-[400px] flex flex-col">
              <div className="flex items-center gap-3 text-text-secondary mb-6 border-b border-border/50 pb-4 shrink-0">
                <div className="p-2 rounded-lg bg-primary/5 dark:bg-primary/10 text-primary">
                  <Clock size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-primary tracking-tight">Application History</h2>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                {history.length > 0 ? (
                  <div className="relative border-l-2 border-border/50 ml-3 md:ml-4 space-y-8 pb-4">
                    {history.map((event, index) => (
                      <div key={event.id} className="relative pl-6 md:pl-8 group">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-card bg-slate-300 dark:bg-slate-600 shadow-sm transition-colors group-hover:bg-primary"></div>
                        
                        <div className="flex flex-col space-y-1">
                          <time className="text-xs font-semibold tracking-wider text-text-muted uppercase">
                            {format(new Date(event.changed_at), "MMM d, yyyy")}
                          </time>
                          <div className="text-sm text-text-primary bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-border/50 inline-block shadow-sm">
                            {event.old_status ? (
                              <>Changed to <span className="font-semibold text-primary">{event.new_status}</span></>
                            ) : (
                              <>Created as <span className="font-semibold text-primary">{event.new_status}</span></>
                            )}
                            {event.old_status && (
                              <div className="text-xs text-text-muted mt-1">
                                Previously: {event.old_status}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center pb-8">
                    <Clock size={32} className="text-slate-200 dark:text-slate-700 mb-3" />
                    <p className="text-text-muted italic text-sm">No history available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApplicationForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdate}
        initialData={app}
      />

      <ConfirmDialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title="Delete application?"
        message="This action cannot be undone. Are you sure you want to permanently delete this application?"
      />
    </div>
  );
}
