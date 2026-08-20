'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Plus, MoreHorizontal, Filter } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import FilterMenu from '@/components/tasks/FilterMenu';
import { X } from 'lucide-react';

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
      setName(''); setDescription(''); setPriority('none'); setDueDate('');
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  // Apply filters (client-side for projects)
  const filteredProjects = projects.filter((p: any) => {
    if (filters.priority && p.priority !== filters.priority) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">Projects</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)} className="p-2 hover:bg-hover-bg rounded-lg">
                <Filter className="w-4 h-4 text-text-muted" />
              </button>
              {filterOpen && <FilterMenu filters={filters} onFilterChange={setFilters} onClose={() => setFilterOpen(false)} />}
            </div>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-text-primary text-bg-primary rounded-lg text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 overflow-y-auto">
        <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg">
          <div className="grid grid-cols-[1fr_120px_120px_130px_60px] gap-4 px-4 py-2.5 bg-bg-secondary border-b border-border-primary text-xs font-medium text-text-secondary uppercase">
            <span>Project</span><span>Priority</span><span>Lead</span><span>Due Date</span><span>Actions</span>
          </div>
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">Loading...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">No projects found.</div>
          ) : (
            filteredProjects.map((project: any) => (
              <div key={project.id}
                className="grid grid-cols-[1fr_120px_120px_130px_60px] gap-4 px-4 py-3 border-b border-border-secondary last:border-b-0 hover:bg-hover-bg cursor-pointer items-center"
                onClick={() => router.push(`/projects/${project.id}`)}>
                <span className="text-sm font-medium text-text-primary truncate">{project.name}</span>
                <PriorityBadge priority={project.priority} />
                <div className="flex items-center gap-1.5">
                  {project.lead && (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
                        {project.lead.name?.charAt(0)}
                      </div>
                      <span className="text-sm text-text-secondary truncate">{project.lead.name}</span>
                    </>
                  )}
                </div>
                <span className="text-sm text-text-secondary">
                  {project.dueDate ? format(new Date(project.dueDate), 'dd MMM yyyy') : '—'}
                </span>
                <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete project?')) deleteProject.mutate(project.id); }}
                  className="p-1 hover:bg-hover-bg rounded">
                  <MoreHorizontal className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-md bg-card-bg border border-card-border rounded-2xl shadow-xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
              <h2 className="text-lg font-semibold text-text-primary">Add Project</h2>
              <button onClick={() => setAddOpen(false)} className="p-1 hover:bg-hover-bg rounded"><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) createProject.mutate({ name: name.trim(), description, priority, dueDate: dueDate || undefined }); }}
              className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary h-20 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
                    <option value="none">No Priority</option><option value="urgent">Urgent</option>
                    <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-text-secondary hover:bg-hover-bg rounded-lg">Cancel</button>
                <button type="submit" disabled={createProject.isPending}
                  className="px-4 py-2 text-sm bg-text-primary text-bg-primary rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
                  {createProject.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
