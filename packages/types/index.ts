// ============ Enums ============

export enum TaskStatus {
  TODO = 'todo',
  DOING = 'doing',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
}

export enum Priority {
  NONE = 'none',
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum ColorMode {
  AMBER = 'amber',
  BLUE = 'blue',
  PINK = 'pink',
  ROSE = 'rose',
  EMERALD = 'emerald',
  BLACK = 'black',
}

export enum TaskView {
  BOARD = 'board',
  LIST = 'list',
}

export enum WorkspaceRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum AuthProvider {
  GUEST = 'guest',
  GOOGLE = 'google',
}

// ============ Display Helpers ============

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.DOING]: 'Doing',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.ON_HOLD]: 'On Hold',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.NONE]: 'No Priority',
  [Priority.URGENT]: 'Urgent',
  [Priority.HIGH]: 'High',
  [Priority.MEDIUM]: 'Medium',
  [Priority.LOW]: 'Low',
};

export const STATUS_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.DOING,
  TaskStatus.COMPLETED,
  TaskStatus.ON_HOLD,
];

// ============ Interfaces ============

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  username: string | null;
  title: string | null;
  avatarUrl: string | null;
  authProvider: string;
  createdAt: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  role: string;
}

export interface ProjectResponse {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  priority: string;
  lead: UserResponse | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabelResponse {
  id: string;
  name: string;
  color: string;
}

export interface TeamResponse {
  id: string;
  name: string;
}

export interface TaskMemberResponse {
  userId: string;
  user: UserResponse;
}

export interface TaskResponse {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  reporter: UserResponse | null;
  team: TeamResponse | null;
  dueDate: string | null;
  position: number;
  members: TaskMemberResponse[];
  labels: { label: LabelResponse }[];
  project: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskResponse {
  id: string;
  taskId: string;
  title: string;
  status: string;
  priority: string;
  assignee: UserResponse | null;
  dueDate: string | null;
  createdAt: string;
}

export interface CommentResponse {
  id: string;
  taskId: string;
  content: string;
  author: UserResponse;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferenceResponse {
  theme: string;
  colorMode: string;
  taskView: string;
  visibleFields: VisibleFields;
}

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

// ============ Request Types ============

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  reporterId?: string;
  teamId?: string;
  dueDate?: string;
  memberIds?: string[];
  labelIds?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: string | null;
  reporterId?: string | null;
  teamId?: string | null;
  dueDate?: string | null;
  memberIds?: string[];
  labelIds?: string[];
  position?: number;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  priority?: string;
  leadId?: string;
  dueDate?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  priority?: string;
  leadId?: string | null;
  dueDate?: string | null;
}

export interface CreateSubtaskRequest {
  title: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateSubtaskRequest {
  title?: string;
  status?: string;
  priority?: string;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  title?: string;
  avatarUrl?: string;
}

export interface UpdatePreferencesRequest {
  theme?: string;
  colorMode?: string;
  taskView?: string;
  visibleFields?: Partial<VisibleFields>;
}

export interface TaskQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  assigneeId?: string;
  labelId?: string;
  teamId?: string;
  reporterId?: string;
}
