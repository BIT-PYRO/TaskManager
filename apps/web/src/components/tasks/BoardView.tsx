'use client';

import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';

const STATUS_COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'Doing' },
  { key: 'completed', label: 'Completed' },
  { key: 'on_hold', label: 'On Hold' },
];

interface BoardViewProps {
  tasks: any[];
  visibleFields: Record<string, boolean>;
  onAddTask: (status?: string) => void;
}

export default function BoardView({ tasks, visibleFields, onAddTask }: BoardViewProps) {
  const queryClient = useQueryClient();

  const columns = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    STATUS_COLUMNS.forEach((col) => { grouped[col.key] = []; });
    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateTask(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleDrop = (taskId: string, newStatus: string) => {
    updateTaskStatus.mutate({ id: taskId, status: newStatus });
  };

  return (
    <div className="flex gap-4 px-6 pb-6 overflow-x-auto h-full">
      {STATUS_COLUMNS.map((col) => (
        <div
          key={col.key}
          className="flex-shrink-0 w-[280px] flex flex-col"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-accent/5'); }}
          onDragLeave={(e) => { e.currentTarget.classList.remove('bg-accent/5'); }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-accent/5');
            const taskId = e.dataTransfer.getData('taskId');
            if (taskId) handleDrop(taskId, col.key);
          }}
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <GripVertical className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-semibold text-text-primary">{col.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAddTask(col.key)}
                className="p-0.5 hover:bg-hover-bg rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-text-muted" />
              </button>
              <button className="p-0.5 hover:bg-hover-bg rounded transition-colors">
                <MoreHorizontal className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 space-y-2.5 overflow-y-auto">
            {columns[col.key]?.map((task) => (
              <TaskCard key={task.id} task={task} visibleFields={visibleFields} />
            ))}
          </div>

          {/* Add task button */}
          <button
            onClick={() => onAddTask(col.key)}
            className="flex items-center gap-1.5 mt-2 px-2 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-hover-bg rounded-lg transition-colors w-full"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      ))}
    </div>
  );
}
