import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { toast } from 'react-hot-toast';
import { Briefcase, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError('Unable to create your account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md rounded-3xl bg-card/70 dark:bg-card/90 backdrop-blur-xl p-8 sm:p-10 shadow-premium border border-border/60 relative animate-fade-in-up">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
            <Briefcase size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Create an account</h1>
          <p className="mt-2 text-sm font-medium text-text-secondary">Start tracking your job applications</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-sm font-medium text-red-800 dark:text-red-400 ring-1 ring-inset ring-red-600/20 dark:ring-red-500/20 flex items-start gap-3">
            <svg className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full rounded-xl border border-border bg-background dark:bg-slate-800 px-4 py-3 text-sm font-medium text-text-primary placeholder-text-muted dark:placeholder-text-disabled transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-sm"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-xl border border-border bg-background dark:bg-slate-800 px-4 py-3 text-sm font-medium text-text-primary placeholder-text-muted dark:placeholder-text-disabled transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
                className="w-full rounded-xl border border-border bg-background dark:bg-slate-800 pl-4 pr-10 py-3 text-sm font-medium text-text-primary placeholder-text-muted dark:placeholder-text-disabled transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-xl border border-border bg-background dark:bg-slate-800 pl-4 pr-10 py-3 text-sm font-medium text-text-primary placeholder-text-muted dark:placeholder-text-disabled transition-all duration-200 hover:border-primary/30 focus:border-primary focus:bg-card dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-sm"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-premium focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover hover:underline underline-offset-4 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
