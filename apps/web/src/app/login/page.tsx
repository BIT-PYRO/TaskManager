'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Triangle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
            <Triangle className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">Pyramid</span>
        </div>

        {/* Card */}
        <div className="border border-border-primary rounded-2xl p-8 bg-card-bg">
          <h1 className="text-xl font-semibold text-center text-text-primary mb-1">
            Let&apos;s get back on track
          </h1>
          <p className="text-sm text-text-secondary text-center mb-6">
            Enter your email below to login to your account.
          </p>

          {/* Continue as Guest */}
          <button
            id="guest-login-btn"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full h-11 bg-text-primary text-bg-primary rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mb-3 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-bg-primary border-t-transparent" />
            ) : (
              'Continue as Guest'
            )}
          </button>

          {/* Login with Google */}
          <button
            id="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full h-11 bg-card-bg border border-border-primary rounded-lg font-medium text-sm text-text-primary hover:bg-hover-bg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </button>
        </div>

        {/* Terms */}
        <p className="text-xs text-text-muted text-center mt-6">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline hover:text-text-secondary">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-text-secondary">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
