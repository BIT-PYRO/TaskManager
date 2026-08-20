'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { MoreHorizontal, Calendar, Tag } from 'lucide-react';
import { useState } from 'react';
import TaskActions from './TaskActions';

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
      className="bg-card-bg border border-card-border rounded-xl p-3.5 cursor-pointer hover:shadow-sm transition-shadow group"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      {/* Title and actions */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3 className="text-sm font-medium text-text-primary leading-snug">{task.title}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); setActionsOpen(!actionsOpen); }}
          className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-hover-bg rounded transition-all shrink-0"
        >
          <MoreHorizontal className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* Member and Due Date row */}
      <div className="flex items-center justify-between mb-2">
        {visibleFields.members && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
              {memberName.charAt(0)}
            </div>
            <span className="text-xs text-text-secondary">{memberName}</span>
          </div>
        )}
        {visibleFields.dueDate && dueDate && (
          <div className="flex items-center gap-1 text-red-500">
            <Calendar className="w-3 h-3" />
            <span className="text-xs font-medium">{dueDate}</span>
          </div>
        )}
      </div>

      {/* Labels */}
      {visibleFields.labels && labels.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {labels.map((label: any) => (
            <span
              key={label.id}
              className="flex items-center gap-0.5 text-[11px] text-text-secondary bg-bg-tertiary px-1.5 py-0.5 rounded"
            >
              <Tag className="w-2.5 h-2.5" />
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Actions dropdown */}
      {actionsOpen && (
        <TaskActions
          task={task}
          onClose={() => setActionsOpen(false)}
        />
      )}
    </div>
  );
}
