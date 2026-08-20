# 🔺 Pyramid — Task Management System

A production-quality full-stack task management system built with **Next.js 16**, **NestJS 11**, **Prisma**, and **PostgreSQL**.

## ✨ Features

- **Authentication** — Guest login with JWT cookies (Google OAuth ready)
- **Kanban Board** — Drag-and-drop task management across 4 status columns
- **List View** — Grouped table layout with collapsible status sections
- **Projects** — Project management with filtered task views
- **Task Detail** — Full task detail page with editable properties, subtasks, and comments
- **Search** — Debounced full-text search across tasks
- **Fields Menu** — Toggle visible columns (priority, members, date, labels, etc.)
- **Filter Menu** — Nested filter by status, priority, team, member, label, reporter
- **Theme System** — Light/Dark mode with 6 accent colors (12 combinations)
- **Settings** — Profile editing, theme selection, color mode selection
- **Responsive** — Mobile sidebar with hamburger menu, responsive layouts

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TailwindCSS 4 |
| State | TanStack Query v5, React Context |
| Backend | NestJS 11, Passport JWT |
| Database | PostgreSQL 16, Prisma ORM |
| Styling | CSS Variables + Tailwind (theme system) |
| Icons | Lucide React |
| Drag & Drop | HTML5 Drag API |

## 📁 Project Structure

```
pyramid-task-manager/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema (12 models)
│   │   │   └── seed.ts         # Demo data seed script
│   │   └── src/
│   │       ├── auth/           # JWT auth, guest login
│   │       ├── tasks/          # Tasks CRUD + filtering
│   │       ├── projects/       # Projects CRUD
│   │       ├── subtasks/       # Subtasks CRUD
│   │       ├── comments/       # Comments
│   │       ├── labels/         # Labels
│   │       ├── teams/          # Teams
│   │       ├── users/          # User profile
│   │       ├── preferences/    # Theme/color/view prefs
│   │       ├── workspaces/     # Leave workspace
│   │       └── prisma/         # Database service
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── login/      # Login page
│           │   └── (dashboard)/
│           │       ├── tasks/  # Board & List views
│           │       ├── projects/  # Projects list & detail
│           │       └── settings/  # Profile, theme, colors
│           ├── components/
│           │   ├── layout/     # Sidebar, UserMenu
│           │   ├── tasks/      # BoardView, ListView, TaskCard, etc.
│           │   └── shared/     # PriorityBadge
│           ├── providers/      # Auth, Theme, Query
│           └── lib/            # API client
├── packages/
│   └── types/                  # Shared TypeScript types
├── docker-compose.yml          # PostgreSQL container
└── package.json                # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- Docker Desktop (for PostgreSQL)
- npm

### Setup

```bash
# 1. Clone and install
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Wait 5 seconds for DB to be ready, then run migrations
npx prisma migrate dev --name init
# (run from apps/api directory)

# 4. Seed demo data
npm run db:seed

# 5. Start both apps
npm run dev:api   # Terminal 1 — API on :3001
npm run dev:web   # Terminal 2 — Web on :3000
```

### One-liner setup

```bash
npm run setup
```

## 🎨 Theme System

The app supports **12 theme combinations**:

| Theme | Colors |
|-------|--------|
| Light | Amber, Blue, Pink, Rose, Emerald, Black |
| Dark  | Amber, Blue, Pink, Rose, Emerald, Black |

Themes are controlled via `data-theme` and `data-color` attributes on `<html>`, with CSS custom properties providing all color values.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/guest` | Guest login (sets JWT cookie) |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout |
| GET | `/tasks` | List tasks (with filtering) |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/tasks/:id` | Get task detail |
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| GET | `/tasks/:id/subtasks` | List subtasks |
| POST | `/tasks/:id/subtasks` | Create subtask |
| GET | `/tasks/:id/comments` | List comments |
| POST | `/tasks/:id/comments` | Create comment |
| GET | `/labels` | List labels |
| GET | `/teams` | List teams |
| GET/PATCH | `/preferences` | User preferences |
| PATCH | `/users/me` | Update profile |

## 🔐 Authentication

- **Guest Login**: Creates a new user with full demo workspace (teams, projects, tasks, subtasks, comments)
- **JWT**: Stored in HTTP-only cookie, 7-day expiry
- **Google OAuth**: Structured but requires credentials setup

## 📊 Database Schema

12 Prisma models: `User`, `Workspace`, `WorkspaceMember`, `Project`, `Task`, `TaskMember`, `Label`, `TaskLabel`, `Team`, `Subtask`, `Comment`, `UserPreference`

## License

MIT
