'use client';

import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChevronRight, X } from 'lucide-react';

interface FilterMenuProps {
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  onClose: () => void;
}

const FILTER_GROUPS = [
  { key: 'status', label: 'Status', options: [
    { value: 'todo', label: 'To Do' }, { value: 'doing', label: 'Doing' },
    { value: 'completed', label: 'Completed' }, { value: 'on_hold', label: 'On Hold' },
  ]},
  { key: 'priority', label: 'Priority', options: [
    { value: 'none', label: 'No Priority' }, { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' },
  ]},
];

export default function FilterMenu({ filters, onFilterChange, onClose }: FilterMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const { data: labels = [] } = useQuery({ queryKey: ['labels'], queryFn: api.getLabels });
  const { data: teams = [] } = useQuery({ queryKey: ['teams'], queryFn: api.getTeams });
  const { data: members = [] } = useQuery({ queryKey: ['members'], queryFn: api.getWorkspaceMembers });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleSelect = (key: string, value: string) => {
    if (filters[key] === value) {
      const next = { ...filters };
      delete next[key];
      onFilterChange(next);
    } else {
      onFilterChange({ ...filters, [key]: value });
    }
    setActiveGroup(null);
  };

  const clearAll = () => { onFilterChange({}); setActiveGroup(null); };
  const hasFilters = Object.keys(filters).length > 0;

  const dynamicGroups = [
    ...FILTER_GROUPS,
    { key: 'assigneeId', label: 'Members', options: members.map((m: any) => ({ value: m.id, label: m.name })) },
    { key: 'teamId', label: 'Teams', options: teams.map((t: any) => ({ value: t.id, label: t.name })) },
    { key: 'labelId', label: 'Labels', options: labels.map((l: any) => ({ value: l.id, label: l.name })) },
    { key: 'reporterId', label: 'Reporter', options: members.map((m: any) => ({ value: m.id, label: m.name })) },
  ];

  return (
    <div ref={ref} className="absolute right-0 top-10 z-50 w-52 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden">
      {activeGroup === null ? (
        <div className="py-1">
          {hasFilters && (
            <button onClick={clearAll} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-hover-bg">
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
          {dynamicGroups.map((group) => (
            <button
              key={group.key}
              onClick={() => setActiveGroup(group.key)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-hover-bg ${
                filters[group.key] ? 'text-accent font-medium' : 'text-text-primary'
              }`}
            >
              {group.label}
              <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
            </button>
          ))}
        </div>
      ) : (
        <div className="py-1">
          <button
            onClick={() => setActiveGroup(null)}
            className="w-full text-left px-4 py-2 text-xs text-text-muted hover:bg-hover-bg"
          >
            ← Back
          </button>
          {dynamicGroups.find((g) => g.key === activeGroup)?.options.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(activeGroup, opt.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-hover-bg ${
                filters[activeGroup] === opt.value ? 'text-accent font-medium' : 'text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
