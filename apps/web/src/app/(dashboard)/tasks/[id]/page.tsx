'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Users, Flag, MoreHorizontal } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' }, { value: 'doing', label: 'Doing' },
  { value: 'completed', label: 'Completed' }, { value: 'on_hold', label: 'On Hold' },
];
const PRIORITY_OPTIONS = [
  { value: 'none', label: 'No Priority' }, { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' },
];

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => api.getTask(id),
  });

  const { data: subtasks = [] } = useQuery({
    queryKey: ['subtasks', id],
    queryFn: () => api.getSubtasks(id),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => api.getComments(id),
  });

  const updateTask = useMutation({
    mutationFn: (data: any) => api.updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task', id] }),
  });

  const addComment = useMutation({
    mutationFn: (content: string) => api.createComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setCommentText('');
    },
  });

  const addSubtask = useMutation({
    mutationFn: (title: string) => api.createSubtask(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', id] });
      setNewSubtask('');
    },
  });

  const updateSubtask = useMutation({
    mutationFn: ({ subId, data }: { subId: string; data: any }) => api.updateSubtask(subId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subtasks', id] }),
  });

  const deleteSubtask = useMutation({
    mutationFn: (subId: string) => api.deleteSubtask(subId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subtasks', id] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return <div className="p-6 text-text-secondary">Task not found</div>;
  }

  const labels = task.labels?.map((tl: any) => tl.label) || [];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-primary">
        <button onClick={() => router.back()} className="p-1 hover:bg-hover-bg rounded">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </button>
        <div className="text-sm text-text-muted">
          Tasks / <span className="text-text-primary font-medium">{task.title}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left content */}
        <div className="flex-1 p-6 space-y-6 min-w-0">
          {/* Title */}
          <h1 className="text-xl font-semibold text-text-primary">{task.title}</h1>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
            <p className="text-sm text-text-primary leading-relaxed">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Labels */}
          {labels.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-2">Labels</h3>
              <div className="flex gap-2 flex-wrap">
                {labels.map((l: any) => (
                  <span key={l.id} className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-bg-tertiary text-text-secondary border border-border-primary">
                    <Tag className="w-3 h-3" />{l.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Subtasks</h3>
            <div className="border border-card-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_80px_60px] gap-2 px-4 py-2 bg-bg-secondary text-xs font-medium text-text-muted uppercase">
                <span>Task</span><span>Status</span><span>Priority</span><span></span>
              </div>
              {subtasks.map((sub: any) => (
                <div key={sub.id} className="grid grid-cols-[1fr_100px_80px_60px] gap-2 px-4 py-2.5 border-t border-border-secondary items-center">
                  <span className="text-sm text-text-primary">{sub.title}</span>
                  <select value={sub.status} onChange={(e) => updateSubtask.mutate({ subId: sub.id, data: { status: e.target.value } })}
                    className="text-xs bg-transparent text-text-secondary border border-border-primary rounded px-1 py-0.5">
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <PriorityBadge priority={sub.priority} />
                  <button onClick={() => deleteSubtask.mutate(sub.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newSubtask.trim()) addSubtask.mutate(newSubtask.trim()); }}
                placeholder="Add a subtask..." className="flex-1 px-3 py-1.5 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
              <button onClick={() => { if (newSubtask.trim()) addSubtask.mutate(newSubtask.trim()); }}
                className="px-3 py-1.5 text-sm bg-text-primary text-bg-primary rounded-lg font-medium">Add</button>
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Updates</h3>
            <div className="space-y-3 mb-3">
              {comments.length === 0 && (
                <p className="text-sm text-text-muted">No comments yet.</p>
              )}
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {comment.author?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-text-primary">{comment.author?.name}</span>
                      <span className="text-xs text-text-muted">{format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) addComment.mutate(commentText.trim()); }}
                placeholder="Write a comment..." className="flex-1 px-3 py-2 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
              <button onClick={() => { if (commentText.trim()) addComment.mutate(commentText.trim()); }}
                className="px-4 py-2 text-sm bg-text-primary text-bg-primary rounded-lg font-medium">Send</button>
            </div>
          </div>
        </div>

        {/* Right sidebar - Details */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border-primary p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Details</h3>

          <div>
            <label className="text-xs text-text-muted block mb-1">Status</label>
            <select value={task.status} onChange={(e) => updateTask.mutate({ status: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1">Priority</label>
            <select value={task.priority} onChange={(e) => updateTask.mutate({ priority: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary">
              {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1">Due Date</label>
            <input type="date" value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => updateTask.mutate({ dueDate: e.target.value || null })}
              className="w-full px-3 py-1.5 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary" />
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1">Members</label>
            <div className="flex items-center gap-1.5">
              {task.members?.map((m: any) => (
                <div key={m.userId} className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold"
                  title={m.user?.name}>{m.user?.name?.charAt(0)}</div>
              ))}
            </div>
          </div>

          {task.team && (
            <div>
              <label className="text-xs text-text-muted block mb-1">Team</label>
              <span className="text-sm text-text-primary">{task.team.name}</span>
            </div>
          )}

          {task.reporter && (
            <div>
              <label className="text-xs text-text-muted block mb-1">Reporter</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[8px] font-bold">
                  {task.reporter.name?.charAt(0)}
                </div>
                <span className="text-sm text-text-primary">{task.reporter.name}</span>
              </div>
            </div>
          )}

          {task.project && (
            <div>
              <label className="text-xs text-text-muted block mb-1">Project</label>
              <span className="text-sm text-accent cursor-pointer hover:underline"
                onClick={() => router.push(`/projects/${task.project.id}`)}>{task.project.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
