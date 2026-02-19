import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

// Types matching schema
export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "Suspended";

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
}

export interface Task {
  id: string;
  jiraId: string;
  title: string;
  status: TaskStatus;
  note: string;
  projectIds: string[];
  archived: boolean;
  order: number;
}

export interface Settings {
  jiraBaseUrl: string;
  emailStartText: string;
  emailEndText: string;
  setupCompleted: boolean;
}

interface AppState {
  tasks: Task[];
  projects: Project[];
  settings: Settings;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'order' | 'archived'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  
  addProject: (project: Omit<Project, 'id'>) => string;
  deleteProject: (id: string) => void;
  
  updateSettings: (updates: Partial<Settings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tasks: [],
      projects: [],
      settings: {
        jiraBaseUrl: '',
        emailStartText: 'Daily Status Update:',
        emailEndText: 'Thanks,',
        setupCompleted: false,
      },
      theme: 'system',

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: nanoid(),
          order: state.tasks.length,
          archived: false,
        };
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          
          const updatedTask = { ...t, ...updates };
          
          // Auto-archive logic
          if (
            (updates.status === 'Completed' || updates.status === 'Suspended') && 
            t.status !== 'Completed' && t.status !== 'Suspended'
          ) {
            updatedTask.archived = true;
          }
          
          // Un-archive logic
          if (
            (updates.status === 'Not Started' || updates.status === 'In Progress') && 
            (t.status === 'Completed' || t.status === 'Suspended')
          ) {
            updatedTask.archived = false;
          }

          return updatedTask;
        }),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

      reorderTasks: (newOrder) => set({ tasks: newOrder }),

      addProject: (projectData) => {
        const id = nanoid();
        set((state) => ({
          projects: [...state.projects, { ...projectData, id }],
        }));
        return id;
      },

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        // Also remove project from tasks
        tasks: state.tasks.map(t => ({
          ...t,
          projectIds: t.projectIds.filter(pid => pid !== id)
        }))
      })),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),

      setTheme: (theme) => set(() => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme };
      }),
    }),
    {
      name: 'dev-status-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Hydrate theme
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    }
  )
);
