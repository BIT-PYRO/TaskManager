'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Plus, MoreHorizontal, Filter, X, Loader2 } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import FilterMenu from '@/components/tasks/FilterMenu';

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('none');
  const [dueDate, setDueDate] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const createProject = useMutation({
    mutationFn: (data: any) => api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setAddOpen(false);
      setName('');
      setDescription('');
      setPriority('none');
      setDueDate('');
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  // Client-side project priority filtering
  const filteredProjects = projects.filter((p: any) => {
    if (filters.priority && p.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-5 border-b border-border-primary shrink-0 bg-bg-primary">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Projects</h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2.5 border border-border-primary hover:bg-hover-bg rounded-xl text-text-muted hover:text-text-primary transition-colors bg-card-bg shadow-xs"
                aria-label="Filter projects"
              >
                <Filter className="w-4 h-4" />
              </button>
              {filterOpen && (
                <FilterMenu
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setFilterOpen(false)}
                />
              )}
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-text-primary text-bg-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects List Container */}
      <div className="px-8 py-6 flex-1 overflow-y-auto">
        <div className="border border-card-border rounded-2xl overflow-hidden bg-card-bg shadow-xs">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_140px_160px_140px_60px] gap-4 px-6 py-3.5 bg-bg-secondary/70 border-b border-border-primary text-xs font-bold text-text-muted uppercase tracking-wider items-center">
            <span>Project Name</span>
            <span>Priority</span>
            <span>Project Lead</span>
            <span>Due Date</span>
            <span className="text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-accent border-t-transparent" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-text-muted">
              No projects found. Create one to get started!
            </div>
          ) : (
            filteredProjects.map((project: any) => (
              <div
                key={project.id}
                className="grid grid-cols-[1fr_140px_160px_140px_60px] gap-4 px-6 py-4 border-b border-border-secondary/60 last:border-b-0 hover:bg-hover-bg/80 transition-colors cursor-pointer items-center group"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate block">
                    {project.name}
                  </span>
                  {project.description && (
                    <p className="text-xs text-text-muted truncate">{project.description}</p>
                  )}
                </div>

                <div>
                  <PriorityBadge priority={project.priority} />
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  {project.lead ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {project.lead.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-text-secondary truncate">
                        {project.lead.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-text-muted">—</span>
                  )}
                </div>

                <span className="text-xs font-medium text-text-secondary">
                  {project.dueDate ? format(new Date(project.dueDate), 'dd MMM yyyy') : '—'}
                </span>

                <div className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this project?')) {
                        deleteProject.mutate(project.id);
                      }
                    }}
                    className="p-1.5 hover:bg-hover-bg rounded-lg text-text-muted hover:text-red-500 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {addOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setAddOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-border-primary">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Create New Project</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="p-1.5 hover:bg-hover-bg rounded-xl text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) {
                  createProject.mutate({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    priority,
                    dueDate: dueDate || undefined,
                  });
                }
              }}
              className="p-7 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Website Redesign 2026"
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
                  className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent resize-none h-24"
                  placeholder="Summary of project goals and scope..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-hover-bg rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProject.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-text-primary text-bg-primary rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                  {createProject.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
