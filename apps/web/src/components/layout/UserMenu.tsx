'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Settings, Sun, Moon, Palette, ChevronRight, Check, LogOut, ArrowLeft } from 'lucide-react';

interface UserMenuProps {
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'black', label: 'Monochrome', color: '#1f2937' },
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
    <div
      ref={menuRef}
      className="absolute left-3 top-16 z-50 w-64 bg-card-bg border border-card-border rounded-2xl shadow-xl overflow-hidden backdrop-blur-md"
    >
      {/* User Info Header */}
      <div className="px-4 py-3.5 border-b border-border-primary bg-bg-secondary/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
            {user?.name?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main Options */}
      {subMenu === null && (
        <div className="py-2 space-y-0.5">
          <button
            onClick={() => setSubMenu('theme')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-hover-bg transition-colors"
          >
            <span className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-text-muted" />
              <span>Change Theme</span>
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>

          <button
            onClick={() => setSubMenu('color')}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-hover-bg transition-colors"
          >
            <span className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-text-muted" />
              <span>Color Mode</span>
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>

          <button
            onClick={() => {
              router.push('/settings/profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-hover-bg transition-colors"
          >
            <Settings className="w-4 h-4 text-text-muted" />
            <span>Settings</span>
          </button>

          <div className="border-t border-border-primary pt-1.5 mt-1">
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Theme Submenu */}
      {subMenu === 'theme' && (
        <div className="py-2 space-y-0.5">
          <button
            onClick={() => setSubMenu(null)}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-muted hover:bg-hover-bg transition-colors border-b border-border-primary mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to menu
          </button>
          {[
            { value: 'light', label: 'Light Mode', icon: Sun },
            { value: 'dark', label: 'Dark Mode', icon: Moon },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setSubMenu(null);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-hover-bg transition-colors"
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-text-muted" />
                <span>{label}</span>
              </span>
              {theme === value && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      )}

      {/* Color Submenu */}
      {subMenu === 'color' && (
        <div className="py-2 space-y-0.5 max-h-64 overflow-y-auto">
          <button
            onClick={() => setSubMenu(null)}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-text-muted hover:bg-hover-bg transition-colors border-b border-border-primary mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to menu
          </button>
          {COLOR_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => {
                setColorMode(value);
                setSubMenu(null);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-hover-bg transition-colors"
            >
              <span className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{label}</span>
              </span>
              {colorMode === value && <Check className="w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
