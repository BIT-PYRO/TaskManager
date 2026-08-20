'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import BoardView from '@/components/tasks/BoardView';
import ListView from '@/components/tasks/ListView';
import FieldsMenu from '@/components/tasks/FieldsMenu';
import FilterMenu from '@/components/tasks/FilterMenu';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { Search, SlidersHorizontal, Filter, Plus, LayoutGrid, X } from 'lucide-react';

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<string | undefined>();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleFields, setVisibleFields] = useState({
    priority: true, members: true, dueDate: true, labels: true, status: true, reporter: true,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load preferences
  const { data: prefs } = useQuery({
    queryKey: ['preferences'],
    queryFn: api.getPreferences,
  });

  useEffect(() => {
    if (prefs) {
      setView(prefs.taskView === 'list' ? 'list' : 'board');
      if (prefs.visibleFields) {
        setVisibleFields(prefs.visibleFields as any);
      }
    }
  }, [prefs]);

  // Build query params
  const queryParams: Record<string, string> = { ...filters };
  if (debouncedSearch) queryParams.search = debouncedSearch;

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', queryParams],
    queryFn: () => api.getTasks(Object.keys(queryParams).length > 0 ? queryParams : undefined),
  });

  const handleViewChange = (newView: 'board' | 'list') => {
    setView(newView);
    api.updatePreferences({ taskView: newView }).catch(() => {});
  };

  const handleFieldToggle = (field: string, value: boolean) => {
    const updated = { ...visibleFields, [field]: value };
    setVisibleFields(updated);
    api.updatePreferences({ visibleFields: updated }).catch(() => {});
  };

  const handleAddTask = (status?: string) => {
    setAddTaskStatus(status);
    setAddTaskOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleViewChange(view === 'board' ? 'list' : 'board')}
            className="p-1.5 hover:bg-hover-bg rounded transition-colors"
            aria-label="Toggle view"
          >
            <LayoutGrid className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">Tasks</h1>

          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-1 border border-border-primary rounded-lg px-2 py-1.5 bg-card-bg">
                <Search className="w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="bg-transparent text-sm text-text-primary outline-none w-40 placeholder:text-text-muted"
                  autoFocus
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                  <X className="w-3.5 h-3.5 text-text-muted" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-hover-bg rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-text-muted" />
              </button>
            )}

            {/* Fields */}
            <div className="relative">
              <button
                onClick={() => setFieldsOpen(!fieldsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border-primary rounded-lg hover:bg-hover-bg transition-colors text-text-primary"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Fields
              </button>
              {fieldsOpen && (
                <FieldsMenu
                  view={view}
                  onViewChange={handleViewChange}
                  visibleFields={visibleFields}
                  onFieldToggle={handleFieldToggle}
                  onClose={() => setFieldsOpen(false)}
                />
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2 hover:bg-hover-bg rounded-lg transition-colors"
                aria-label="Filter"
              >
                <Filter className="w-4 h-4 text-text-muted" />
              </button>
              {filterOpen && (
                <FilterMenu
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setFilterOpen(false)}
                />
              )}
            </div>

            {/* Add Task */}
            <button
              onClick={() => handleAddTask()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-text-primary text-bg-primary rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
          </div>
        ) : view === 'board' ? (
          <BoardView
            tasks={tasks}
            visibleFields={visibleFields}
            onAddTask={handleAddTask}
          />
        ) : (
          <ListView
            tasks={tasks}
            visibleFields={visibleFields}
            onAddTask={handleAddTask}
          />
        )}
      </div>

      {/* Add Task Modal */}
      {addTaskOpen && (
        <AddTaskModal
          defaultStatus={addTaskStatus}
          onClose={() => setAddTaskOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setAddTaskOpen(false);
          }}
        />
      )}
    </div>
  );
}
