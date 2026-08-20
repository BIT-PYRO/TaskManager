'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User as UserIcon, Check, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [title, setTitle] = useState(user?.title || '');
  const [saved, setSaved] = useState(false);

  const updateProfile = useMutation({
    mutationFn: (data: any) => api.updateProfile(data),
    onSuccess: async () => {
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name: name.trim(),
      username: username.trim() || undefined,
      title: title.trim() || undefined,
    });
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Profile Settings</h2>
        <p className="text-sm text-text-secondary">
          Manage your account profile details and display preferences.
        </p>
      </div>

      {/* User Avatar Card */}
      <div className="flex items-center gap-5 p-6 bg-card-bg border border-card-border rounded-2xl shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
          {name.charAt(0)?.toUpperCase() || 'D'}
        </div>
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold text-text-primary truncate">{name || user?.name}</h3>
          <p className="text-sm text-text-muted truncate">{user?.email}</p>
          <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium mt-1">
            {user?.authProvider?.toUpperCase() || 'GUEST'} ACCOUNT
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border rounded-2xl p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent outline-none transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent outline-none transition-all"
            placeholder="Choose a unique username"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Title / Role
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent outline-none transition-all"
            placeholder="e.g. Designer, Software Engineer"
          />
        </div>

        {/* Form Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-primary rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
          >
            {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>

          {saved && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4" /> Changes saved successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
