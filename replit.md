# Dev Status

## Overview

Dev Status is a personal, minimalist Jira companion web app for developers to track active work throughout the day and generate a plain-text daily status email. It's designed to be fast, clean, and drag-based for priority ordering.

**Key design decision:** Despite having a full Express + PostgreSQL backend scaffolding, **all data persistence happens in the browser via localStorage**. The backend exists only to serve the frontend and provide a health check endpoint. The Drizzle/PostgreSQL schema is used primarily for type generation and structural consistency, not for actual data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React + Vite + Tailwind)
- **Framework:** React with TypeScript, bundled by Vite
- **Styling:** Tailwind CSS with shadcn/ui component library (new-york style)
- **Routing:** wouter (lightweight client-side router)
- **State Management:** Zustand with `persist` middleware to localStorage — this is the primary data layer
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable for task priority reordering
- **ID Generation:** nanoid for creating unique task/project IDs client-side
- **Theme:** Light/dark mode with iOS/macOS-inspired design aesthetic, toggled via Zustand store
- **Location:** `client/src/`

### Data Models (defined in `shared/schema.ts`)
- **Task:** id, jiraId, title, status (Not Started | In Progress | Completed | Suspended), note, projectIds[], archived, order
- **Project:** id, name, repoUrl
- **Settings:** jiraBaseUrl, emailStartText, emailEndText, setupCompleted

All data lives in Zustand store persisted to localStorage. The Drizzle pgTable definitions exist for type inference but are not queried at runtime.

### Backend (Express)
- **Server:** Express on Node.js with HTTP server (`server/index.ts`)
- **Routes:** Minimal — only `/api/health` endpoint (`server/routes.ts`)
- **Storage:** In-memory stub (`server/storage.ts`) — not used by the app
- **Database:** Drizzle ORM configured for PostgreSQL (`server/db.ts`, `drizzle.config.ts`) but the connection is essentially unused. The DATABASE_URL environment variable is expected by the config but the app doesn't depend on it for functionality.
- **Dev Server:** Vite dev middleware served through Express (`server/vite.ts`)
- **Production:** Client built to `dist/public`, server bundled via esbuild to `dist/index.cjs`

### Key Components
- `client/src/hooks/use-store.ts` — Central Zustand store with all state and actions
- `client/src/components/TaskCard.tsx` — Sortable task card with inline editing
- `client/src/components/CreateTaskDialog.tsx` — Dialog for adding new tasks
- `client/src/components/EmailGenerator.tsx` — Generates and copies daily status report to clipboard
- `client/src/components/SettingsModal.tsx` — Configures Jira base URL and email templates
- `client/src/components/ProjectManager.tsx` — CRUD for projects via popover
- `client/src/components/ThemeToggle.tsx` — Light/dark theme toggle
- `client/src/pages/Home.tsx` — Main page with DnD context, search, tabs (active/archived)

### Build & Scripts
- `npm run dev` — Starts dev server with Vite HMR via tsx
- `npm run build` — Builds client (Vite) then server (esbuild) to `dist/`
- `npm start` — Runs production build from `dist/index.cjs`
- `npm run db:push` — Drizzle schema push (not needed for core functionality)

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL** via Drizzle ORM — configured but not actively used for data persistence. The `DATABASE_URL` environment variable should be set for the server to start without errors, but the app functions entirely on localStorage.

### UI Libraries
- **shadcn/ui** — Full component library installed in `client/src/components/ui/`
- **Radix UI** — Underlying primitives for all shadcn components
- **Lucide React** — Icon library
- **@dnd-kit** — Drag and drop toolkit (core, sortable, utilities)
- **class-variance-authority + clsx + tailwind-merge** — Styling utilities

### State & Data
- **Zustand** — Client-side state management with localStorage persistence
- **@tanstack/react-query** — Installed and configured but minimally used (app is local-only)
- **Zod + drizzle-zod** — Schema validation and type generation
- **nanoid** — Client-side UUID generation

### Fonts
- Inter (sans-serif) and JetBrains Mono (monospace) via Google Fonts
- Additional fonts loaded: DM Sans, Fira Code, Geist Mono, Architects Daughter

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — Error overlay in dev
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)