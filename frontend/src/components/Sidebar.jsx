import { Link, useLocation } from "react-router-dom";
import { Briefcase, LayoutDashboard, X, Layers } from "lucide-react";
import { cn } from "../utils/cn";
import { useMobileMenu } from "../App";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobileMenu();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Applications", href: "/applications", icon: Layers },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-transparent">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 duration-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-slate-700 text-white shadow-sm">
              <Briefcase size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary">QuickHire</span>
          </Link>
          <button 
            className="md:hidden p-1.5 text-text-secondary hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Menu</div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/5 dark:bg-slate-800"
                    : "text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary hover:translate-x-1"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-primary stroke-[2.5px]" : "text-text-secondary group-hover:text-primary"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:translate-x-1 dark:hover:bg-red-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 transition-colors duration-200 group-hover:text-red-600"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
