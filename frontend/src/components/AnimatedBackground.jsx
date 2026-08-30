import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate static particle definitions once on mount
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      left: Math.random() * 100, // 0 to 100%
      top: Math.random() * 100, // 0 to 100%
      duration: Math.random() * 20 + 20, // 20s to 40s
      delay: Math.random() * -20, // Negative delay to start at random positions
      xOffset: (Math.random() - 0.5) * 200, // Random movement radius
      yOffset: (Math.random() - 0.5) * 200,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700 bg-background">
      {/* Base Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
           style={{
             backgroundImage: `
               linear-gradient(to right, currentColor 1px, transparent 1px),
               linear-gradient(to bottom, currentColor 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px',
             color: theme === 'dark' ? '#ffffff' : '#000000'
           }}
      />

      {/* Floating Gradient Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 animate-float"
           style={{
             background: theme === 'dark' 
               ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)' // Indigo
               : 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
             animationDuration: '25s'
           }}
      />
      <div className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 animate-float-delayed"
           style={{
             background: theme === 'dark'
               ? 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)' // Purple
               : 'radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, transparent 70%)',
             animationDuration: '30s',
             animationDelay: '-5s'
           }}
      />
      <div className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20 animate-float"
           style={{
             background: theme === 'dark'
               ? 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)' // Sky
               : 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)',
             animationDuration: '40s',
             animationDelay: '-15s'
           }}
      />

      {/* Particles Layer */}
      <div className="absolute inset-0 z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary opacity-20 dark:bg-white dark:opacity-30 mix-blend-screen"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              '--tx': `${p.xOffset}px`,
              '--ty': `${p.yOffset}px`,
              animation: `particle-float ${p.duration}s infinite ease-in-out alternate`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
