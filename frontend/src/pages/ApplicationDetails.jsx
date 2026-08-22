import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase, FileText } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { getApplication, updateApplication, deleteApplication } from "../api/applications";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApp = async () => {
    try {
      const data = await getApplication(id);
      setApp(data);
    } catch (error) {
      toast.error("Application not found");
      navigate("/applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await updateApplication(id, data);
      toast.success("Application updated");
      setIsEditing(false);
      fetchApp();
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
          <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <Header title="Application Details" />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">{app.company}</h1>
                <p className="text-xl text-text-secondary mb-4">{app.position}</p>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg px-4 py-2 border border-border bg-white text-sm font-medium text-text-primary shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleting(true)}
                  className="rounded-lg px-4 py-2 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-text-secondary mb-2">
                <MapPin size={18} />
                <h3 className="font-medium">Location</h3>
              </div>
              <p className="text-text-primary font-medium">{app.location}</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-text-secondary mb-2">
                <Calendar size={18} />
                <h3 className="font-medium">Applied Date</h3>
              </div>
              <p className="text-text-primary font-medium">{format(new Date(app.applied_date), "MMMM d, yyyy")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 text-text-secondary mb-2">
                <Briefcase size={18} />
                <h3 className="font-medium">Current Status</h3>
              </div>
              <p className="text-text-primary font-medium">{app.status}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-text-secondary mb-6 border-b border-border pb-4">
              <FileText size={20} />
              <h2 className="text-lg font-semibold text-text-primary">Notes</h2>
            </div>
            {app.notes ? (
              <p className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                {app.notes}
              </p>
            ) : (
              <p className="text-text-secondary italic">No notes provided for this application.</p>
            )}
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
