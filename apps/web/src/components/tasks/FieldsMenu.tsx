'use client';

import { useRef, useEffect } from 'react';
import { List, LayoutGrid } from 'lucide-react';

interface FieldsMenuProps {
  view: 'board' | 'list';
  onViewChange: (view: 'board' | 'list') => void;
  visibleFields: Record<string, boolean>;
  onFieldToggle: (field: string, value: boolean) => void;
  onClose: () => void;
}

const FIELDS = [
  { key: 'priority', label: 'Priority' },
  { key: 'members', label: 'Members' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'members', label: 'Members' },
  { key: 'labels', label: 'Labels' },
  { key: 'status', label: 'Status' },
  { key: 'reporter', label: 'Reporter' },
];

// Remove duplicates
const UNIQUE_FIELDS = FIELDS.filter((f, i, arr) => arr.findIndex(x => x.key === f.key) === i);

export default function FieldsMenu({ view, onViewChange, visibleFields, onFieldToggle, onClose }: FieldsMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-10 z-50 w-56 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden">
      {/* View Toggle */}
      <div className="flex border-b border-border-primary">
        <button
          onClick={() => onViewChange('list')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            view === 'list'
              ? 'text-text-primary border-b-2 border-accent'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <List className="w-4 h-4" /> List
        </button>
        <button
          onClick={() => onViewChange('board')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            view === 'board'
              ? 'text-text-primary border-b-2 border-accent'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Board
        </button>
      </div>

      {/* Fields */}
      <div className="py-2">
        {UNIQUE_FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-hover-bg"
          >
            <span className="text-sm text-text-primary">{field.label}</span>
            <input
              type="checkbox"
              checked={visibleFields[field.key] ?? true}
              onChange={(e) => onFieldToggle(field.key, e.target.checked)}
              className="w-4 h-4 rounded border-border-primary accent-accent"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
