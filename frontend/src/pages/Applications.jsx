import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getApplications, createApplication, updateApplication, deleteApplication } from "../api/applications";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchApps = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createApplication(data);
      toast.success("Application created smoothly.");
      setIsFormOpen(false);
      fetchApps();
    } catch (error) {
      toast.error("Failed to create application");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateApplication(editingApp.id, data);
      toast.success("Application updated smoothly.");
      setEditingApp(null);
      fetchApps();
    } catch (error) {
      toast.error("Failed to update application");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(deletingApp.id);
      toast.success("Application removed.");
      setDeletingApp(null);
      fetchApps();
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header title="Applications" />
        <main className="flex-1 p-8 overflow-y-auto">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <Header title="Applications" />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Applications</h2>
            <p className="text-text-secondary mt-1">Track every opportunity in one place.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover hover:-translate-y-px hover:shadow active:scale-95"
          >
            <Plus size={18} />
            Add Application
          </button>
        </div>

        {applications.length === 0 ? (
          <EmptyState onAdd={() => setIsFormOpen(true)} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search company, role, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-text-primary transition-colors hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
              >
                <option value="">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {filteredApps.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-text-secondary">No applications match your search.</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <ApplicationTable
                    applications={filteredApps}
                    onEdit={setEditingApp}
                    onDelete={setDeletingApp}
                  />
                </div>
                <div className="md:hidden space-y-4">
                  {filteredApps.map(app => (
                    <ApplicationCard key={app.id} app={app} onEdit={setEditingApp} onDelete={setDeletingApp} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <ApplicationForm
        isOpen={isFormOpen || !!editingApp}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSubmit={editingApp ? handleUpdate : handleCreate}
        initialData={editingApp}
      />

      <ConfirmDialog
        isOpen={!!deletingApp}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleDelete}
        title="Delete application?"
        message="This action cannot be undone. Are you sure you want to permanently delete this application?"
      />
    </div>
  );
}
