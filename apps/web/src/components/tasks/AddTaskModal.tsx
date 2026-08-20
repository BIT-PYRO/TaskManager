'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { X } from 'lucide-react';

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
    if (!title.trim()) { setError('Title is required'); return; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-card-bg border border-card-border rounded-2xl shadow-xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
          <h2 className="text-lg font-semibold text-text-primary">Add Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-hover-bg rounded">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
              placeholder="Add a description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
                <option value="none">No Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Project</label>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
                <option value="">None</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Team</label>
            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
              <option value="">None</option>
              {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Labels</label>
            <div className="flex flex-wrap gap-2">
              {labels.map((l: any) => (
                <button key={l.id} type="button"
                  onClick={() => setSelectedLabels((prev) => prev.includes(l.id) ? prev.filter((x) => x !== l.id) : [...prev, l.id])}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    selectedLabels.includes(l.id)
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'bg-bg-tertiary border-border-primary text-text-secondary hover:border-text-muted'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-text-secondary hover:bg-hover-bg rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createTask.isPending}
              className="px-4 py-2 text-sm bg-text-primary text-bg-primary rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
