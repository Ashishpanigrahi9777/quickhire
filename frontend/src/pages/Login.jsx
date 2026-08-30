import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md rounded-3xl bg-card/70 dark:bg-card/90 backdrop-blur-xl p-8 sm:p-10 shadow-premium border border-border/60 relative animate-fade-in-up">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
            <Briefcase size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm font-medium text-text-secondary">Log in to your QuickHire account</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-sm font-medium text-red-800 dark:text-red-400 ring-1 ring-inset ring-red-600/20 dark:ring-red-500/20 flex items-start gap-3">
            <svg className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-xl border border-border bg-background pl-4 pr-10 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-premium focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary-hover hover:underline underline-offset-4 transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
