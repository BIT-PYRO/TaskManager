'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { X, Loader2 } from 'lucide-react';

interface AddTaskModalProps {
  defaultStatus?: string;
  projectId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTaskModal({ defaultStatus, projectId, onClose, onSuccess }: AddTaskModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(defaultStatus || 'todo');
  const [priority, setPriority] = useState('none');
  const [dueDate, setDueDate] = useState('');
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');

  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: api.getProjects });
  const { data: teams = [] } = useQuery({ queryKey: ['teams'], queryFn: api.getTeams });
  const { data: labels = [] } = useQuery({ queryKey: ['labels'], queryFn: api.getLabels });
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const createTask = useMutation({
    mutationFn: (data: any) => api.createTask(data),
    onSuccess: () => onSuccess(),
    onError: (err: any) => setError(err.message || 'Failed to create task'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setError('');

    createTask.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
      projectId: selectedProject || undefined,
      teamId: selectedTeam || undefined,
      reporterId: user?.id,
      memberIds: user?.id ? [user.id] : [],
      labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border-primary">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-hover-bg rounded-xl text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all"
              placeholder="e.g. Design System Documentation"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary focus:ring-2 focus:ring-accent outline-none transition-all resize-none h-24"
              placeholder="Provide context or details about this task..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
              >
                <option value="none">No Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
              >
                <option value="">None (Standalone Task)</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Assigned Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
            >
              <option value="">None</option>
              {teams.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Labels</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {labels.map((l: any) => {
                const isSelected = selectedLabels.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() =>
                      setSelectedLabels((prev) =>
                        prev.includes(l.id) ? prev.filter((x) => x !== l.id) : [...prev, l.id]
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-accent shadow-xs'
                        : 'bg-bg-tertiary border-border-primary text-text-secondary hover:border-text-muted'
                    }`}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-hover-bg rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTask.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-text-primary text-bg-primary rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
            >
              {createTask.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
