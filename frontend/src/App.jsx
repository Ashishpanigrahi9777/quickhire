import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { createContext, useContext, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AnimatedBackground from './components/AnimatedBackground';

const MobileMenuContext = createContext();

export const useMobileMenu = () => useContext(MobileMenuContext);

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ isMobileMenuOpen, setIsMobileMenuOpen }}>
      <div className="flex h-screen w-full overflow-hidden relative">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative z-10">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </MobileMenuContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedBackground />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: {
                  primary: 'var(--color-accent)',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
