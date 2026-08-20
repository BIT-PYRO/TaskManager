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
    <div className="flex gap-6 px-8 pb-8 overflow-x-auto h-full items-start select-none">
      {STATUS_COLUMNS.map((col) => {
        const colTasks = columns[col.key] || [];
        return (
          <div
            key={col.key}
            className="flex-shrink-0 w-80 bg-bg-secondary/60 border border-border-primary/80 rounded-2xl p-4 flex flex-col max-h-full transition-colors"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('ring-2', 'ring-accent/30', 'bg-accent/5');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('ring-2', 'ring-accent/30', 'bg-accent/5');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('ring-2', 'ring-accent/30', 'bg-accent/5');
              const taskId = e.dataTransfer.getData('taskId');
              if (taskId) handleDrop(taskId, col.key);
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-bold text-text-primary tracking-tight">{col.label}</span>
                <span className="text-xs font-semibold text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-full border border-border-primary">
                  {colTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAddTask(col.key)}
                  className="p-1 hover:bg-hover-bg rounded-lg text-text-muted hover:text-text-primary transition-colors"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  className="p-1 hover:bg-hover-bg rounded-lg text-text-muted hover:text-text-primary transition-colors"
                  title="Column Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cards Container */}
            <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} visibleFields={visibleFields} />
              ))}
            </div>

            {/* Add Task Button at bottom of column */}
            <button
              onClick={() => onAddTask(col.key)}
              className="flex items-center justify-center gap-2 mt-4 px-3 py-2.5 text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-hover-bg rounded-xl border border-dashed border-border-primary hover:border-text-muted transition-all w-full shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
