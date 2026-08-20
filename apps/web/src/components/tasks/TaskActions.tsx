'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';

interface TaskActionsProps {
  task: any;
  onClose: () => void;
}

const STATUSES = [
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'Doing' },
  { key: 'completed', label: 'Completed' },
  { key: 'on_hold', label: 'On Hold' },
];

const PRIORITIES = [
  { key: 'none', label: 'No Priority' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

export default function TaskActions({ task, onClose }: TaskActionsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const updateTask = useMutation({
    mutationFn: (data: any) => api.updateTask(task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const deleteTask = useMutation({
    mutationFn: () => api.deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  return (
    <div ref={ref} className="absolute right-0 top-8 z-50 w-48 bg-card-bg border border-card-border rounded-xl shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="py-1">
        <button
          onClick={() => { router.push(`/tasks/${task.id}`); onClose(); }}
          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-hover-bg"
        >
          Open
        </button>

        {/* Status submenu */}
        <div className="border-t border-border-primary">
          <p className="px-4 py-1.5 text-xs text-text-muted font-medium">Status</p>
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => updateTask.mutate({ status: s.key })}
              className={`w-full text-left px-4 py-1.5 text-sm hover:bg-hover-bg ${task.status === s.key ? 'text-accent font-medium' : 'text-text-primary'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Priority submenu */}
        <div className="border-t border-border-primary">
          <p className="px-4 py-1.5 text-xs text-text-muted font-medium">Priority</p>
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              onClick={() => updateTask.mutate({ priority: p.key })}
              className={`w-full text-left px-4 py-1.5 text-sm hover:bg-hover-bg ${task.priority === p.key ? 'text-accent font-medium' : 'text-text-primary'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="border-t border-border-primary">
          <button
            onClick={() => { if (confirm('Delete this task?')) deleteTask.mutate(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-hover-bg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
