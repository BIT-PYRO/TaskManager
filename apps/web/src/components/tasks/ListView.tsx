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
    <div className="px-8 pb-8 overflow-y-auto h-full space-y-6 select-none">
      {STATUS_GROUPS.map((group) => {
        const groupTasks = grouped[group.key] || [];
        const isCollapsed = collapsed[group.key];

        return (
          <div key={group.key} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => toggleCollapse(group.key)}
                className="flex items-center gap-2 text-sm font-bold text-text-primary hover:text-accent transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
                <span>{group.label}</span>
                <span className="text-xs font-semibold text-text-muted bg-bg-tertiary px-2 py-0.5 rounded-full border border-border-primary ml-1">
                  {groupTasks.length}
                </span>
              </button>
            </div>

            {!isCollapsed && (
              <div className="space-y-2">
                {/* Table Container */}
                <div className="border border-card-border rounded-2xl overflow-hidden bg-card-bg shadow-xs">
                  {/* Table Header */}
                  <div
                    className="grid gap-4 px-6 py-3 bg-bg-secondary/70 border-b border-border-primary text-xs font-bold text-text-muted uppercase tracking-wider items-center"
                    style={{
                      gridTemplateColumns: `1fr ${visibleFields.priority ? '140px' : ''} ${visibleFields.members ? '140px' : ''} ${visibleFields.dueDate ? '140px' : ''} 60px`,
                    }}
                  >
                    <span>Task Title</span>
                    {visibleFields.priority && <span>Priority</span>}
                    {visibleFields.members && <span>Assignee</span>}
                    {visibleFields.dueDate && <span>Due Date</span>}
                    <span className="text-right">Actions</span>
                  </div>

                  {/* Table Rows */}
                  {groupTasks.length === 0 ? (
                    <div className="px-6 py-8 text-center text-sm text-text-muted">
                      No tasks in this section.
                    </div>
                  ) : (
                    groupTasks.map((task) => {
                      const memberName = task.members?.[0]?.user?.name || task.reporter?.name || 'Admin';
                      const memberInitials = memberName.charAt(0)?.toUpperCase() || 'A';

                      return (
                        <div
                          key={task.id}
                          className="grid gap-4 px-6 py-4 border-b border-border-secondary/60 last:border-b-0 hover:bg-hover-bg/80 transition-colors cursor-pointer items-center group"
                          style={{
                            gridTemplateColumns: `1fr ${visibleFields.priority ? '140px' : ''} ${visibleFields.members ? '140px' : ''} ${visibleFields.dueDate ? '140px' : ''} 60px`,
                          }}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        >
                          <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                            {task.title}
                          </span>

                          {visibleFields.priority && (
                            <div>
                              <PriorityBadge priority={task.priority} />
                            </div>
                          )}

                          {visibleFields.members && (
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                {memberInitials}
                              </div>
                              <span className="text-xs font-medium text-text-secondary truncate">
                                {memberName}
                              </span>
                            </div>
                          )}

                          {visibleFields.dueDate && (
                            <span className="text-xs font-medium text-text-secondary">
                              {task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : '—'}
                            </span>
                          )}

                          <div className="relative text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActions(activeActions === task.id ? null : task.id);
                              }}
                              className="p-1.5 hover:bg-hover-bg rounded-lg text-text-muted hover:text-text-primary transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {activeActions === task.id && (
                              <TaskActions task={task} onClose={() => setActiveActions(null)} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Task Button */}
                <button
                  onClick={() => onAddTask(group.key)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-hover-bg rounded-xl border border-dashed border-border-primary hover:border-text-muted transition-all w-full justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task to {group.label}</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
