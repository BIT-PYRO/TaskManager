'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { CheckSquare, FolderOpen, ChevronDown, Settings, X, Layers } from 'lucide-react';
import UserMenu from './UserMenu';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const navItems = [
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="h-full flex flex-col bg-sidebar-bg border-r border-border-primary select-none">
      {/* User header */}
      <div className="relative flex items-center justify-between px-4 h-16 border-b border-border-primary shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-sidebar-text truncate">
              {user?.name || 'Dexter'}
            </span>
            <span className="text-xs text-text-muted truncate">
              {user?.title || 'Workspace Member'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="p-1.5 hover:bg-hover-bg rounded-lg text-text-muted hover:text-text-primary transition-colors"
            aria-label="User settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-hover-bg rounded-lg text-text-muted lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User menu dropdown */}
        {userMenuOpen && (
          <UserMenu onClose={() => setUserMenuOpen(false)} />
        )}
      </div>

      {/* Workspace section */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="flex items-center justify-between w-full text-xs font-bold text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Workspace
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              workspaceOpen ? '' : '-rotate-90'
            }`}
          />
        </button>
      </div>

      {/* Navigation Links */}
      {workspaceOpen && (
        <nav className="px-3 mt-1 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose?.();
                }}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-active text-text-primary font-semibold shadow-xs'
                    : 'text-sidebar-text hover:bg-hover-bg hover:text-text-primary'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
