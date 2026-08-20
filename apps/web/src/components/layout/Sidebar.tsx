'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useState, useRef, useEffect } from 'react';
import { CheckSquare, FolderOpen, ChevronDown, Settings, X } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-sidebar-bg border-r border-border-primary">
      {/* User header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border-primary">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <span className="text-sm font-semibold text-sidebar-text truncate">
            {user?.name || 'Dexter'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="p-1 hover:bg-hover-bg rounded transition-colors"
            aria-label="User settings"
          >
            <Settings className="w-4 h-4 text-text-muted" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-hover-bg rounded lg:hidden">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* User menu dropdown */}
      {userMenuOpen && (
        <UserMenu onClose={() => setUserMenuOpen(false)} />
      )}

      {/* Workspace section */}
      <div className="px-3 pt-4">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="flex items-center justify-between w-full px-1 py-1 text-xs font-medium text-text-secondary uppercase tracking-wider"
        >
          <span>Workspace</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${workspaceOpen ? '' : '-rotate-90'}`} />
        </button>
      </div>

      {/* Navigation */}
      {workspaceOpen && (
        <nav className="px-3 mt-1 flex-1">
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
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-sidebar-active text-text-primary'
                    : 'text-sidebar-text hover:bg-hover-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
