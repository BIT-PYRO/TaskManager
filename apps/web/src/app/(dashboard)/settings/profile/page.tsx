'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
      setTimeout(() => setSaved(false), 2000);
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
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold text-text-primary mb-1">Profile</h2>
      <p className="text-sm text-text-secondary mb-6">Manage your personal information</p>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
          {name.charAt(0) || 'D'}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{name || user?.name}</p>
          <p className="text-xs text-text-muted">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary"
            placeholder="Choose a username" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary"
            placeholder="e.g. Designer, Developer" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={updateProfile.isPending}
            className="px-4 py-2 text-sm bg-text-primary text-bg-primary rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-emerald-500">✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}
