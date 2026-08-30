import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { useState } from "react";

export default function MacWindowControls() {
  const { theme } = useTheme();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleClose = () => {
    toast.success("Close action", { duration: 1500 });
  };

  const handleMinimize = () => {
    toast("Minimize action", { duration: 1500 });
  };

  const handleMaximize = () => {
    toast.success("Maximize action", { duration: 1500 });
  };

  const controlClass = (color) => {
    const baseClass = "relative w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center";
    const hoverClass = "hover:scale-110 active:scale-95 hover:shadow-lg";
    const darkHover = "dark:hover:brightness-110";
    
    if (color === "red") {
      return `${baseClass} ${hoverClass} ${darkHover} bg-red-500 hover:bg-red-600 dark:hover:bg-red-400`;
    }
    if (color === "yellow") {
      return `${baseClass} ${hoverClass} ${darkHover} bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-300`;
    }
    if (color === "green") {
      return `${baseClass} ${hoverClass} ${darkHover} bg-green-500 hover:bg-green-600 dark:hover:bg-green-400`;
    }
  };

  const iconClass = "absolute text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-900";

  return (
    <div className="flex items-center">
      {/* Container with glassmorphism */}
      <div className="relative group">
        <div className={`
          flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-lg
          backdrop-blur-md transition-all duration-200
          ${
            theme === "dark"
              ? "bg-slate-800/30 border border-slate-600/30 hover:bg-slate-700/40 hover:border-slate-500/40 shadow-lg hover:shadow-xl"
              : "bg-white/40 border border-white/60 hover:bg-white/50 hover:border-white/80 shadow-md hover:shadow-lg"
          }
          hover:-translate-y-0.5
        `}>
          {/* Red Close Button */}
          <button
            onClick={handleClose}
            onMouseEnter={() => setHoveredButton("close")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`${controlClass("red")} group relative`}
            title="Close"
            aria-label="Close"
          >
            <span className={`${iconClass} group-hover:opacity-100`}>×</span>
          </button>

          {/* Yellow Minimize Button */}
          <button
            onClick={handleMinimize}
            onMouseEnter={() => setHoveredButton("minimize")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`${controlClass("yellow")} group relative`}
            title="Minimize"
            aria-label="Minimize"
          >
            <span className={`${iconClass} group-hover:opacity-100`}>−</span>
          </button>

          {/* Green Maximize Button */}
          <button
            onClick={handleMaximize}
            onMouseEnter={() => setHoveredButton("maximize")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`${controlClass("green")} group relative`}
            title="Maximize"
            aria-label="Maximize"
          >
            <span className={`${iconClass} group-hover:opacity-100`}>⛶</span>
          </button>
        </div>

        {/* Glow effect on container hover (subtle) */}
        <div className={`
          absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur
          ${
            theme === "dark"
              ? "bg-blue-500/20"
              : "bg-blue-400/20"
          }
        `} />
      </div>
    </div>
  );
}
