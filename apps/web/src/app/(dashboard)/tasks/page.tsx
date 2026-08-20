'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import BoardView from '@/components/tasks/BoardView';
import ListView from '@/components/tasks/ListView';
import FieldsMenu from '@/components/tasks/FieldsMenu';
import FilterMenu from '@/components/tasks/FilterMenu';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import { Search, SlidersHorizontal, Filter, Plus, LayoutGrid, List, X } from 'lucide-react';

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
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Header Bar */}
      <div className="px-8 pt-6 pb-5 border-b border-border-primary shrink-0 bg-bg-primary">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Tasks</h1>
            <div className="flex items-center bg-bg-tertiary p-1 rounded-xl border border-border-primary ml-2">
              <button
                onClick={() => handleViewChange('board')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  view === 'board'
                    ? 'bg-card-bg text-text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title="Board View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline">Board</span>
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  view === 'list'
                    ? 'bg-card-bg text-text-primary shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">List</span>
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-border-primary rounded-xl px-3.5 py-2 bg-card-bg shadow-xs">
                <Search className="w-4 h-4 text-text-muted shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="bg-transparent text-sm text-text-primary outline-none w-48 placeholder:text-text-muted"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-0.5 hover:bg-hover-bg rounded text-text-muted"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 border border-border-primary hover:bg-hover-bg rounded-xl text-text-muted hover:text-text-primary transition-colors bg-card-bg"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Fields Button */}
            <div className="relative">
              <button
                onClick={() => setFieldsOpen(!fieldsOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-border-primary rounded-xl hover:bg-hover-bg transition-colors text-text-primary bg-card-bg shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-text-muted" />
                <span>Fields</span>
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

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold border border-border-primary rounded-xl hover:bg-hover-bg transition-colors bg-card-bg shadow-xs ${
                  Object.keys(filters).length > 0 ? 'text-accent border-accent/40' : 'text-text-muted hover:text-text-primary'
                }`}
                aria-label="Filter"
              >
                <Filter className="w-4 h-4" />
                {Object.keys(filters).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </button>
              {filterOpen && (
                <FilterMenu
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setFilterOpen(false)}
                />
              )}
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => handleAddTask()}
              className="flex items-center gap-2 px-5 py-2 bg-text-primary text-bg-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Board / List View Container */}
      <div className="flex-1 min-h-0 overflow-hidden pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-9 w-9 border-3 border-accent border-t-transparent" />
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
