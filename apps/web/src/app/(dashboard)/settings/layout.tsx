'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, User, Palette, Sun } from 'lucide-react';

const SETTINGS_NAV = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/theme', label: 'Theme', icon: Sun },
  { href: '/settings/colors', label: 'Color Mode', icon: Palette },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Top Header */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-border-primary bg-bg-primary">
        <button
          onClick={() => router.push('/tasks')}
          className="p-2 hover:bg-hover-bg rounded-lg transition-colors text-text-muted hover:text-text-primary"
          aria-label="Back to tasks"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Settings</h1>
      </div>

      {/* Settings Navigation & Content Body */}
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-60 border-r border-border-primary p-6 shrink-0 space-y-2 bg-sidebar-bg">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Preferences
          </p>
          {SETTINGS_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-active text-text-primary shadow-sm font-semibold'
                    : 'text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content View Container */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
