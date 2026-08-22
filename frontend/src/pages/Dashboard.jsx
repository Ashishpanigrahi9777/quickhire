import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarCheck, CheckCircle2, FileText, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import toast from "react-hot-toast";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getApplications, createApplication, updateApplication, deleteApplication } from "../api/applications";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);

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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  const stats = [
    { title: "Total Applications", value: applications.length, icon: Briefcase },
    { title: "Applied", value: applications.filter(a => a.status === "Applied").length, icon: FileText },
    { title: "Interviews", value: applications.filter(a => a.status === "Interview").length, icon: CalendarCheck },
    { title: "Selected", value: applications.filter(a => a.status === "Selected").length, icon: CheckCircle2 },
  ];

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: "Applied", value: statusCounts["Applied"] || 0, color: "#4F46E5" },
    { name: "Assessment", value: statusCounts["Assessment"] || 0, color: "#F59E0B" },
    { name: "Interview", value: statusCounts["Interview"] || 0, color: "#9333EA" },
    { name: "Selected", value: statusCounts["Selected"] || 0, color: "#16A34A" },
    { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#DC2626" },
  ].filter(d => d.value > 0);

  const recentApps = applications.slice(0, 5);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Good morning 👋</h2>
            <p className="text-text-secondary mt-1">Here's an overview of your job search.</p>
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Recent Applications</h3>
                  <Link to="/applications" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    View all
                  </Link>
                </div>
                <div className="hidden md:block">
                  <ApplicationTable
                    applications={recentApps}
                    onEdit={setEditingApp}
                    onDelete={setDeletingApp}
                  />
                </div>
                <div className="md:hidden space-y-4">
                  {recentApps.map(app => (
                    <ApplicationCard key={app.id} app={app} onEdit={setEditingApp} onDelete={setDeletingApp} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-text-primary">Pipeline Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} allowDecimals={false} />
                      <Tooltip
                        cursor={{ fill: "#F8FAFC" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
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
