import { Bell, Search, Menu } from "lucide-react";
import { useMobileMenu } from "../App";

export default function Header({ title }) {
  const { setIsMobileMenuOpen } = useMobileMenu();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden rounded-lg p-2 text-text-secondary hover:bg-gray-50 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button className="hidden sm:flex rounded-full p-2 text-text-secondary hover:bg-gray-50 transition-colors">
          <Search size={20} />
        </button>
        <button className="rounded-full p-2 text-text-secondary hover:bg-gray-50 transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-border ml-2">
          <div className="h-full w-full bg-primary-light text-primary flex items-center justify-center font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
