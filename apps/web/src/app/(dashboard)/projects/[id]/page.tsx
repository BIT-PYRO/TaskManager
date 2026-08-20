'use client';

import { use } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!project) return <div className="p-6 text-text-secondary">Project not found</div>;

  const handleAddTask = (status?: string) => {
    setAddTaskStatus(status);
    setAddTaskOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-primary">
        <button onClick={() => router.back()} className="p-1 hover:bg-hover-bg rounded">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </button>
        <div className="text-sm text-text-muted">
          Projects / <span className="text-text-primary font-medium">{project.name}</span>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border-primary">
        <h1 className="text-xl font-semibold text-text-primary mb-2">{project.name}</h1>
        {project.description && <p className="text-sm text-text-secondary mb-3">{project.description}</p>}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Priority:</span>
            <PriorityBadge priority={project.priority} />
          </div>
          {project.dueDate && (
            <div className="text-text-secondary">
              <span className="text-text-muted">Due:</span> {format(new Date(project.dueDate), 'dd MMM yyyy')}
            </div>
          )}
          {project.lead && (
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className="text-text-muted">Lead:</span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[8px] font-bold">
                {project.lead.name?.charAt(0)}
              </div>
              {project.lead.name}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden pt-4">
        {loadingTasks ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent" />
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
