import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getApplications, createApplication, updateApplication, deleteApplication, exportApplications } from "../api/applications";

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortParam, setSortParam] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Sync state if URL changes directly
  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null && s !== searchQuery) {
      setSearchQuery(s);
      setPage(1);
    }
  }, [searchParams]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getApplications({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sort: sortParam
      });
      setApplications(data.applications);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query changes or trigger fetch when dependencies change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchApps();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, priorityFilter, sortParam, page]);

  const handleCreate = async (data) => {
    try {
      await createApplication(data);
      toast.success("Application created smoothly.");
      setIsFormOpen(false);
      setPage(1); // Reset to first page
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

  const handleExport = async () => {
    try {
      const blob = await exportApplications();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Export successful.");
    } catch (error) {
      toast.error("Failed to export applications");
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <Header title="Applications" />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Applications</h2>
            <p className="text-text-secondary mt-1">Track every opportunity in one place.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-hover hover:-translate-y-px hover:shadow active:scale-95"
            >
              <Plus size={18} />
              Add Application
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search company, role, or location..."
                value={searchQuery}
                onChange={(e) => { 
                  const val = e.target.value;
                  setSearchQuery(val);
                  setSearchParams(val ? { search: val } : {});
                  setPage(1); 
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/70 dark:bg-card/90 backdrop-blur-xl text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-border bg-card/70 dark:bg-card/90 backdrop-blur-xl text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm md:w-36 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Assessment">Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-border bg-card/70 dark:bg-card/90 backdrop-blur-xl text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm md:w-36 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={sortParam}
              onChange={(e) => { setSortParam(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-border bg-card/70 dark:bg-card/90 backdrop-blur-xl text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm md:w-36 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_1rem_center]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company (A-Z)</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {loading && applications.length === 0 ? (
            <LoadingSkeleton />
          ) : applications.length === 0 ? (
            searchQuery || statusFilter || priorityFilter ? (
              <div className="py-12 text-center">
                <p className="text-text-secondary">No applications match your filters.</p>
              </div>
            ) : (
              <EmptyState onAdd={() => setIsFormOpen(true)} />
            )
          ) : (
            <>
              <div className="hidden md:block">
                <ApplicationTable
                  applications={applications}
                  onEdit={setEditingApp}
                  onDelete={setDeletingApp}
                />
              </div>
              <div className="md:hidden space-y-4">
                {applications.map(app => (
                  <ApplicationCard key={app.id} app={app} onEdit={setEditingApp} onDelete={setDeletingApp} />
                ))}
              </div>

              {/* Pagination Controls */}
              {total > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-text-secondary">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1 rounded-md text-text-secondary hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-text-primary px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1 rounded-md text-text-secondary hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
