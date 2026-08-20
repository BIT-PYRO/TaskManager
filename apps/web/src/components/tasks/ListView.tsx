'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Plus, MoreHorizontal } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import TaskActions from './TaskActions';

const STATUS_GROUPS = [
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'Doing' },
  { key: 'completed', label: 'Completed' },
  { key: 'on_hold', label: 'On Hold' },
];

interface ListViewProps {
  tasks: any[];
  visibleFields: Record<string, boolean>;
  onAddTask: (status?: string) => void;
}

export default function ListView({ tasks, visibleFields, onAddTask }: ListViewProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeActions, setActiveActions] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    STATUS_GROUPS.forEach((g) => { groups[g.key] = []; });
    tasks.forEach((task) => {
      if (groups[task.status]) groups[task.status].push(task);
    });
    return groups;
  }, [tasks]);

  const toggleCollapse = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="px-6 pb-6 overflow-y-auto h-full">
      {STATUS_GROUPS.map((group) => {
        const groupTasks = grouped[group.key] || [];
        const isCollapsed = collapsed[group.key];

        return (
          <div key={group.key} className="mb-4">
            {/* Group header */}
            <button
              onClick={() => toggleCollapse(group.key)}
              className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-text-primary"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {group.label}
            </button>

            {!isCollapsed && (
              <>
                {/* Table */}
                <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg">
                  {/* Table header */}
                  <div className="grid gap-4 px-4 py-2.5 bg-bg-secondary border-b border-border-primary text-xs font-medium text-text-secondary uppercase tracking-wider"
                    style={{
                      gridTemplateColumns: `1fr ${visibleFields.priority ? '120px' : ''} ${visibleFields.members ? '100px' : ''} ${visibleFields.dueDate ? '130px' : ''} 60px`,
                    }}
                  >
                    <span>Task</span>
                    {visibleFields.priority && <span>Priority</span>}
                    {visibleFields.members && <span>Members</span>}
                    {visibleFields.dueDate && <span>Due Date</span>}
                    <span>Actions</span>
                  </div>

                  {/* Table rows */}
                  {groupTasks.map((task) => {
                    const memberName = task.members?.[0]?.user?.name || task.reporter?.name || 'Admin';
                    const memberInitials = memberName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

                    return (
                      <div
                        key={task.id}
                        className="grid gap-4 px-4 py-3 border-b border-border-secondary last:border-b-0 hover:bg-hover-bg cursor-pointer items-center"
                        style={{
                          gridTemplateColumns: `1fr ${visibleFields.priority ? '120px' : ''} ${visibleFields.members ? '100px' : ''} ${visibleFields.dueDate ? '130px' : ''} 60px`,
                        }}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        <span className="text-sm text-text-primary font-medium truncate">{task.title}</span>

                        {visibleFields.priority && (
                          <PriorityBadge priority={task.priority} />
                        )}

                        {visibleFields.members && (
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
                              {memberInitials}
                            </div>
                          </div>
                        )}

                        {visibleFields.dueDate && (
                          <span className="text-sm text-text-secondary">
                            {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '—'}
                          </span>
                        )}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActions(activeActions === task.id ? null : task.id);
                            }}
                            className="p-1 hover:bg-hover-bg rounded"
                          >
                            <MoreHorizontal className="w-4 h-4 text-text-muted" />
                          </button>
                          {activeActions === task.id && (
                            <TaskActions task={task} onClose={() => setActiveActions(null)} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add task */}
                <button
                  onClick={() => onAddTask(group.key)}
                  className="flex items-center gap-1.5 mt-2 px-2 py-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
