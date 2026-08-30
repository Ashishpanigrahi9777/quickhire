import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CalendarCheck, CheckCircle2, FileText, Plus, AlertCircle, Percent } from "lucide-react";
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
import { getApplications, getDashboardStats, createApplication, updateApplication, deleteApplication } from "../api/applications";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsData, appsData] = await Promise.all([
        getDashboardStats(),
        getApplications({ page: 1, limit: 5 })
      ]);
      setStats(statsData);
      setRecentApps(appsData.applications);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createApplication(data);
      toast.success("Application created smoothly.");
      setIsFormOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to create application");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateApplication(editingApp.id, data);
      toast.success("Application updated smoothly.");
      setEditingApp(null);
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update application");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(deletingApp.id);
      toast.success("Application removed.");
      setDeletingApp(null);
      fetchDashboardData();
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

  const statCards = [
    { title: "Total Applications", value: stats.total_applications, icon: Briefcase },
    { title: "Applied", value: stats.applied, icon: FileText },
    { title: "Interviews", value: stats.interview, icon: CalendarCheck },
    { title: "Selected", value: stats.selected, icon: CheckCircle2 },
    { title: "High Priority", value: stats.high_priority, icon: AlertCircle },
    { title: "Selection Rate", value: `${stats.selection_rate.toFixed(1)}%`, icon: Percent },
  ];

  const chartData = [
    { name: "Applied", value: stats.applied, color: "#4F46E5" },
    { name: "Assessment", value: stats.assessment, color: "#F59E0B" },
    { name: "Interview", value: stats.interview, color: "#9333EA" },
    { name: "Selected", value: stats.selected, color: "#16A34A" },
    { name: "Rejected", value: stats.rejected, color: "#DC2626" },
  ].filter(d => d.value > 0);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">Good morning <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_infinite]">👋</span></h2>
            <p className="text-text-secondary mt-1.5 text-base">Track your applications and stay on top of your job search.</p>
          </div>
          <div className="absolute -left-10 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium active:scale-95"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
            Add Application
          </button>
        </div>

        {stats.total_applications === 0 ? (
          <EmptyState onAdd={() => setIsFormOpen(true)} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:gap-6">
              {statCards.map((stat, i) => (
                <StatCard key={i} {...stat} index={i} />
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
                {recentApps.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <p className="text-text-secondary text-sm">No recent applications.</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-semibold text-text-primary">Pipeline Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} allowDecimals={false} />
                      <Tooltip
                        cursor={{ fill: theme === 'dark' ? '#1E293B' : '#F8FAFC' }}
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: `1px solid ${theme === 'dark' ? '#334155' : '#E2E8F0'}`, 
                          backgroundColor: theme === 'dark' ? '#0F172A' : '#ffffff',
                          color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
                        }}
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
