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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-primary">
        <button onClick={() => router.push('/tasks')} className="p-1 hover:bg-hover-bg rounded">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-48 border-r border-border-primary py-4 px-3 shrink-0">
          {SETTINGS_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button key={item.href} onClick={() => router.push(item.href)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                  isActive ? 'bg-sidebar-active text-text-primary' : 'text-text-secondary hover:bg-hover-bg'
                }`}>
                <Icon className="w-4 h-4" />{item.label}
              </button>
            );
          })}
        </nav>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
