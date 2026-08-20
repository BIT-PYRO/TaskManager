'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Settings, Sun, Moon, Palette, ChevronRight, Check } from 'lucide-react';

interface UserMenuProps {
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'black', label: 'Black', color: '#1f2937' },
];

export default function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const router = useRouter();
  const [subMenu, setSubMenu] = useState<'theme' | 'color' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef} className="absolute left-3 top-16 z-50 w-56 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden">
      {/* User info */}
      <div className="px-4 py-3 border-b border-border-primary">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {subMenu === null && (
        <div className="py-1">
          <button
            onClick={() => setSubMenu('theme')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
          >
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4" /> Change Theme
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </button>
          <button
            onClick={() => setSubMenu('color')}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color Mode
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </button>
          <button
            onClick={() => { router.push('/settings/profile'); onClose(); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <div className="border-t border-border-primary mt-1 pt-1">
            <button
              onClick={async () => { await logout(); router.push('/login'); onClose(); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-hover-bg"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {subMenu === 'theme' && (
        <div className="py-1">
          <button onClick={() => setSubMenu(null)} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-muted hover:bg-hover-bg">
            ← Back
          </button>
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setSubMenu(null); }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
            >
              <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label}</span>
              {theme === value && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      )}

      {subMenu === 'color' && (
        <div className="py-1">
          <button onClick={() => setSubMenu(null)} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-muted hover:bg-hover-bg">
            ← Back
          </button>
          {COLOR_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => { setColorMode(value); setSubMenu(null); }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
            >
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-border-primary" style={{ backgroundColor: color }} />
                {label}
              </span>
              {colorMode === value && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
