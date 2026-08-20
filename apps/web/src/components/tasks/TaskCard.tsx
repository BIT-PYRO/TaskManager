'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';
import TaskActions from './TaskActions';
import PriorityBadge from '@/components/shared/PriorityBadge';

interface TaskCardProps {
  task: any;
  visibleFields: Record<string, boolean>;
}

export default function TaskCard({ task, visibleFields }: TaskCardProps) {
  const router = useRouter();
  const [actionsOpen, setActionsOpen] = useState(false);

  const memberName = task.members?.[0]?.user?.name || task.reporter?.name || 'Admin';
  const dueDate = task.dueDate ? format(new Date(task.dueDate), 'dd MMM') : null;
  const labels = task.labels?.map((tl: any) => tl.label) || [];

  return (
    <div
      className="relative bg-card-bg border border-card-border rounded-2xl p-4.5 cursor-pointer hover:border-accent/40 hover:shadow-md transition-all group"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      {/* Title & Actions Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-bold text-text-primary leading-snug tracking-tight">
          {task.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActionsOpen(!actionsOpen);
          }}
          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-hover-bg rounded-lg transition-all text-text-muted hover:text-text-primary shrink-0"
          aria-label="Task options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Priority Badge */}
      {visibleFields.priority && task.priority && task.priority !== 'none' && (
        <div className="mb-3">
          <PriorityBadge priority={task.priority} />
        </div>
      )}

      {/* Member and Due Date Row */}
      <div className="flex items-center justify-between gap-2 mb-3 pt-1 border-t border-border-secondary/60">
        {visibleFields.members && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-xs shrink-0">
              {memberName.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-xs font-medium text-text-secondary truncate max-w-[110px]">
              {memberName}
            </span>
          </div>
        )}

        {visibleFields.dueDate && dueDate && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dueDate}</span>
          </div>
        )}
      </div>

      {/* Labels */}
      {visibleFields.labels && labels.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {labels.map((label: any) => (
            <span
              key={label.id}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-bg-tertiary px-2 py-1 rounded-lg border border-border-primary"
            >
              <Tag className="w-3 h-3 text-text-muted" />
              <span>{label.name}</span>
            </span>
          ))}
        </div>
      )}

      {/* Actions Dropdown */}
      {actionsOpen && (
        <TaskActions
          task={task}
          onClose={() => setActionsOpen(false)}
        />
      )}
    </div>
  );
}
