'use client';

import { use } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User as UserIcon } from 'lucide-react';
import BoardView from '@/components/tasks/BoardView';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { useState } from 'react';
import { format } from 'date-fns';
import PriorityBadge from '@/components/shared/PriorityBadge';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<string | undefined>();

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.getProject(id),
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', { projectId: id }],
    queryFn: () => api.getTasks({ projectId: id }),
  });

  const visibleFields = { priority: true, members: true, dueDate: true, labels: true, status: true, reporter: true };

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!project) return <div className="p-8 text-text-secondary">Project not found</div>;

  const handleAddTask = (status?: string) => {
    setAddTaskStatus(status);
    setAddTaskOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Header Breadcrumb */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-border-primary shrink-0 bg-bg-primary">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-hover-bg rounded-xl transition-colors text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-semibold text-text-muted flex items-center gap-2">
          <span>Projects</span>
          <span>/</span>
          <span className="text-text-primary truncate">{project.name}</span>
        </div>
      </div>

      {/* Project Banner Info */}
      <div className="px-8 py-6 border-b border-border-primary shrink-0 bg-bg-primary space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{project.name}</h1>
        </div>

        {project.description && (
          <p className="text-sm text-text-secondary max-w-3xl leading-relaxed">{project.description}</p>
        )}

        <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-text-secondary flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-primary">
            <span className="text-text-muted">Priority:</span>
            <PriorityBadge priority={project.priority} />
          </div>

          {project.dueDate && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-primary">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted">Due:</span>
              <span>{format(new Date(project.dueDate), 'dd MMM yyyy')}</span>
            </div>
          )}

          {project.lead && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-primary">
              <UserIcon className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-muted">Lead:</span>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[8px] font-bold">
                {project.lead.name?.charAt(0)}
              </div>
              <span>{project.lead.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filtered Board View */}
      <div className="flex-1 min-h-0 overflow-hidden pt-6">
        {loadingTasks ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-accent border-t-transparent" />
          </div>
        ) : (
          <BoardView tasks={tasks} visibleFields={visibleFields} onAddTask={handleAddTask} />
        )}
      </div>

      {addTaskOpen && (
        <AddTaskModal
          defaultStatus={addTaskStatus}
          projectId={id}
          onClose={() => setAddTaskOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['tasks', { projectId: id }] });
            setAddTaskOpen(false);
          }}
        />
      )}
    </div>
  );
}
