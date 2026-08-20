'use client';

import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { ArrowLeft, Calendar, Tag, Trash2, Plus, MessageSquare, CheckCircle2 } from 'lucide-react';
import PriorityBadge from '@/components/shared/PriorityBadge';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'doing', label: 'Doing' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const PRIORITY_OPTIONS = [
  { value: 'none', label: 'No Priority' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
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
        <div className="animate-spin rounded-full h-9 w-9 border-3 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!task) {
    return <div className="p-8 text-text-secondary">Task not found</div>;
  }

  const labels = task.labels?.map((tl: any) => tl.label) || [];

  return (
    <div className="h-full overflow-y-auto bg-bg-primary">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-border-primary bg-bg-primary shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-hover-bg rounded-xl transition-colors text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-semibold text-text-muted flex items-center gap-2">
          <span>Tasks</span>
          <span>/</span>
          <span className="text-text-primary truncate">{task.title}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Content Area */}
        <div className="flex-1 p-8 lg:p-12 space-y-8 min-w-0">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-3">
              {task.title}
            </h1>
          </div>

          {/* Description */}
          <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">
              Description
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          {/* Labels */}
          {labels.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Labels
              </h3>
              <div className="flex gap-2 flex-wrap">
                {labels.map((l: any) => (
                  <span
                    key={l.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-bg-tertiary text-text-secondary border border-border-primary"
                  >
                    <Tag className="w-3.5 h-3.5 text-text-muted" />
                    <span>{l.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Subtasks ({subtasks.length})
              </h3>
            </div>

            <div className="border border-card-border rounded-2xl overflow-hidden bg-card-bg shadow-xs">
              <div className="grid grid-cols-[1fr_120px_100px_60px] gap-4 px-6 py-3 bg-bg-secondary/70 border-b border-border-primary text-xs font-bold text-text-muted uppercase tracking-wider">
                <span>Task Name</span>
                <span>Status</span>
                <span>Priority</span>
                <span className="text-right">Action</span>
              </div>

              {subtasks.length === 0 ? (
                <div className="px-6 py-6 text-center text-sm text-text-muted">
                  No subtasks added yet.
                </div>
              ) : (
                subtasks.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="grid grid-cols-[1fr_120px_100px_60px] gap-4 px-6 py-3.5 border-b border-border-secondary/60 last:border-b-0 items-center"
                  >
                    <span className="text-sm font-medium text-text-primary truncate">
                      {sub.title}
                    </span>
                    <select
                      value={sub.status}
                      onChange={(e) =>
                        updateSubtask.mutate({ subId: sub.id, data: { status: e.target.value } })
                      }
                      className="text-xs font-semibold bg-input-bg text-text-secondary border border-input-border rounded-lg px-2 py-1 outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <PriorityBadge priority={sub.priority} />
                    <div className="text-right">
                      <button
                        onClick={() => deleteSubtask.mutate(sub.id)}
                        className="p-1 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        title="Delete subtask"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Subtask Form */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSubtask.trim()) addSubtask.mutate(newSubtask.trim());
                }}
                placeholder="Add a new subtask..."
                className="flex-1 px-4 py-2.5 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={() => {
                  if (newSubtask.trim()) addSubtask.mutate(newSubtask.trim());
                }}
                className="px-5 py-2.5 text-sm font-semibold bg-text-primary text-bg-primary rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Comments / Activity Section */}
          <div className="space-y-4 pt-4 border-t border-border-primary">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              Activity & Comments
            </h3>

            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-text-muted italic bg-bg-secondary/40 p-4 rounded-xl border border-border-primary/50">
                  No activity comments posted yet.
                </p>
              )}
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="flex gap-4 p-4 bg-card-bg border border-card-border rounded-2xl shadow-xs"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                    {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        {comment.author?.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Comment Input */}
            <div className="flex gap-3 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) addComment.mutate(commentText.trim());
                }}
                placeholder="Write an update or comment..."
                className="flex-1 px-4 py-3 text-sm bg-input-bg border border-input-border rounded-xl text-text-primary outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={() => {
                  if (commentText.trim()) addComment.mutate(commentText.trim());
                }}
                className="px-6 py-3 text-sm font-semibold bg-text-primary text-bg-primary rounded-xl hover:opacity-90 transition-all shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border-primary p-8 space-y-6 bg-sidebar-bg shrink-0">
          <h3 className="text-base font-bold text-text-primary border-b border-border-primary pb-3">
            Task Metadata
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Status
            </label>
            <select
              value={task.status}
              onChange={(e) => updateTask.mutate({ status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Priority
            </label>
            <select
              value={task.priority}
              onChange={(e) => updateTask.mutate({ priority: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Due Date
            </label>
            <input
              type="date"
              value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
              onChange={(e) => updateTask.mutate({ dueDate: e.target.value || null })}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-input-bg border border-input-border rounded-xl text-text-primary outline-none"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border-primary">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
              Assigned Members
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {task.members?.map((m: any) => (
                <div
                  key={m.userId}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-tertiary border border-border-primary text-xs font-semibold text-text-primary"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
                    {m.user?.name?.charAt(0)}
                  </div>
                  <span>{m.user?.name}</span>
                </div>
              ))}
            </div>
          </div>

          {task.team && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Team
              </label>
              <p className="text-sm font-semibold text-text-primary">{task.team.name}</p>
            </div>
          )}

          {task.reporter && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Reporter
              </label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[9px] font-bold">
                  {task.reporter.name?.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-text-primary">{task.reporter.name}</span>
              </div>
            </div>
          )}

          {task.project && (
            <div className="space-y-1 pt-2 border-t border-border-primary">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">
                Project
              </label>
              <span
                className="text-sm font-bold text-accent cursor-pointer hover:underline inline-block"
                onClick={() => router.push(`/projects/${task.project.id}`)}
              >
                {task.project.name} →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
