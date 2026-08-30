import { useState } from "react";
import { Bell, Search, Menu, User, Moon, Sun, LogOut, Settings } from "lucide-react";
import { useMobileMenu } from "../App";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import MacWindowControls from "./MacWindowControls";

export default function Header({ title }) {
  const { setIsMobileMenuOpen } = useMobileMenu();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'ME';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/applications?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 md:px-8 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden rounded-lg p-2 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors"
        >
          <Menu size={20} />
        </button>
        {title && <h1 className="text-xl font-bold tracking-tight text-primary hidden sm:block">{title}</h1>}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-md w-full mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-border bg-slate-50/50 dark:bg-slate-800/50 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
          />
        </form>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          title="Toggle Theme"
          className="rounded-full p-2 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative hidden sm:block rounded-full p-2 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-border mx-1"></div>

        {/* macOS Window Controls */}
        <div className="hidden md:block">
          <MacWindowControls />
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 ml-1 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-primary to-primary-hover text-sm font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
              {initials}
            </div>
            <span className="hidden md:block text-sm font-semibold text-text-primary">
              {user?.name || 'User'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-card border border-border/60 shadow-premium p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                </div>
                
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors duration-200">
                  <User size={16} />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors duration-200">
                  <Settings size={16} />
                  Settings
                </button>
                
                <div className="h-px bg-border/50 my-1"></div>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
