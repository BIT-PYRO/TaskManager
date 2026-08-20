'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Triangle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await login();
      router.push('/tasks');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Header */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <Triangle className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-extrabold text-text-primary tracking-tight">Pyramid</span>
        </div>

        {/* Login Card */}
        <div className="border border-card-border rounded-3xl p-8 sm:p-10 bg-card-bg shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Let&apos;s get back on track
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Login to access your tasks, projects, and workspace.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {/* Continue as Guest */}
            <button
              id="guest-login-btn"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full h-12 bg-text-primary text-bg-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Continue as Guest'
              )}
            </button>

            {/* Login with Google */}
            <button
              id="google-login-btn"
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-bg-primary border border-border-primary rounded-xl font-semibold text-sm text-text-primary hover:bg-hover-bg transition-all flex items-center justify-center gap-3 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        {/* Footer Terms */}
        <p className="text-xs text-text-muted text-center leading-relaxed">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-text-secondary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-text-secondary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
