import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types matching schema
export type TaskStatus =
  | "Not Started"
  | "In Progress"
  | "Waiting for Info"
  | "In Dev"
  | "In Prod"
  | "Closed"
  | "Suspended";

const ARCHIVED_STATUSES: TaskStatus[] = ["Closed", "Suspended"];
const ACTIVE_STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Waiting for Info",
  "In Dev",
  "In Prod",
];

const normalizeTaskStatus = (status: string): TaskStatus => {
  if (status === "Completed") {
    return "Closed";
  }

  const validStatuses: TaskStatus[] = [
    "Not Started",
    "In Progress",
    "Waiting for Info",
    "In Dev",
    "In Prod",
    "Closed",
    "Suspended",
  ];

  if (validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }

  return "Not Started";
};

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
}

const getProjectNameFromUrl = (repoUrl: string) => {
  const trimmed = repoUrl.trim();
  const fallback = "project";

  if (!trimmed) {
    return fallback;
  }

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const lastSegment = parsed.pathname
      .split("/")
      .filter(Boolean)
      .pop();

    if (!lastSegment) {
      return fallback;
    }

    return decodeURIComponent(lastSegment).replace(/\.git$/i, "") || fallback;
  } catch {
    const lastSegment = trimmed.split("/").filter(Boolean).pop();
    return (lastSegment || fallback).replace(/\.git$/i, "");
  }
};

const normalizeProjectUrlKey = (repoUrl: string) => {
  const trimmed = repoUrl.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    const host = parsed.host.toLowerCase();
    const path = parsed.pathname
      .replace(/\/+$/, "")
      .replace(/\.git$/i, "")
      .toLowerCase();

    return `${host}${path}`;
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/\/+$/, "")
      .replace(/\.git$/i, "")
      .toLowerCase();
  }
};

const dedupeProjectIds = (projectIds: string[]) =>
  Array.from(new Set(projectIds.filter(Boolean)));

const normalizeTag = (tag: string) => tag.trim().replace(/^#/, "");

const dedupeTags = (tags: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawTag of tags) {
    const normalized = normalizeTag(rawTag);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
};

const CLOUD_DOC_ID = 'state';
const CLOUD_APP_STATE_COLLECTION = 'appState';
const CLOUD_LEGACY_USERS_COLLECTION = 'users';
const LOCAL_SNAPSHOT_PREFIX = 'dev-status:snapshot:';

type CloudSnapshot = {
  tasks: Task[];
  projects: Project[];
  settings: Settings;
  theme: 'light' | 'dark' | 'system';
};

export interface Subtask {
  id: string;
  jiraId: string;
  title: string;
}

export interface Task {
  id: string;
  jiraId: string;
  title: string;
  status: TaskStatus;
  note: string;
  personalNote: string;
  subtasks: Subtask[];
  tags: string[];
  projectIds: string[];
  archived: boolean;
  order: number;
}

type AddTaskInput = {
  jiraId: string;
  title: string;
  status: TaskStatus;
  note: string;
  projectIds: string[];
  personalNote?: string;
  subtasks?: Subtask[];
  tags?: string[];
};

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
  userId: string | null;
  isCloudLoaded: boolean;
  
  // Actions
  addTask: (task: AddTaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  
  addProject: (project: { repoUrl: string }) => string;
  updateProject: (id: string, project: { repoUrl: string }) => void;
  deleteProject: (id: string) => void;

  setUserId: (uid: string | null) => void;
  loadFromCloud: () => Promise<void>;
  resetForSignOut: () => void;
  
  updateSettings: (updates: Partial<Settings>) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  (set, get) => ({
      userId: null,
      isCloudLoaded: false,
      tasks: [],
      projects: [],
      settings: {
        jiraBaseUrl: '',
        emailStartText: 'Daily Status Update:',
        emailEndText: 'Thanks,',
        setupCompleted: true,
      },
      theme: 'system',

      setUserId: (uid) => set({ userId: uid, isCloudLoaded: false }),

      loadFromCloud: async () => {
        const uid = get().userId;
        if (!uid) {
          set({ isCloudLoaded: true });
          return;
        }

        const localSnapshot = readLocalSnapshot(uid);
        if (localSnapshot) {
          set({
            ...localSnapshot,
            isCloudLoaded: true,
          });
          applyTheme(localSnapshot.theme);
        }

        if (!db) {
          set({ isCloudLoaded: true });
          return;
        }

        try {
          const nestedRef = doc(db, CLOUD_LEGACY_USERS_COLLECTION, uid, CLOUD_APP_STATE_COLLECTION, CLOUD_DOC_ID);
          const nestedSnap = await getDoc(nestedRef);

          const legacyRef = doc(db, CLOUD_LEGACY_USERS_COLLECTION, uid);
          const legacySnap = nestedSnap.exists() ? null : await getDoc(legacyRef);
          const snap = nestedSnap.exists() ? nestedSnap : legacySnap;

          if (!snap?.exists()) {
            if (!localSnapshot) {
              set({ isCloudLoaded: true });
            }
            return;
          }

          const data = snap.data() as Partial<CloudSnapshot>;
          const normalized = normalizeSnapshot(data);

          writeLocalSnapshot(uid, normalized);

          set({
            ...normalized,
            isCloudLoaded: true,
          });

          applyTheme(normalized.theme);
        } catch (error) {
          console.error('Failed to load cloud state from Firestore:', error);
          if (!localSnapshot) {
            set({ isCloudLoaded: true });
          }
        }
      },

      resetForSignOut: () => {
        set({
          tasks: [],
          projects: [],
          settings: {
            jiraBaseUrl: '',
            emailStartText: 'Daily Status Update:',
            emailEndText: 'Thanks,',
            setupCompleted: true,
          },
          theme: 'system',
          userId: null,
          isCloudLoaded: false,
        });
        document.documentElement.classList.remove('dark');
      },

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          status: normalizeTaskStatus(taskData.status),
          note: taskData.note || "",
          personalNote: taskData.personalNote || "",
          subtasks: taskData.subtasks || [],
          tags: dedupeTags(taskData.tags || []),
          projectIds: dedupeProjectIds(taskData.projectIds),
          id: nanoid(),
          order: state.tasks.length,
          archived: false,
        };
        queueCloudSave(get);
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTask: (id, updates) => set((state) => {
        const tasks = state.tasks.map((t) => {
          if (t.id !== id) return t;

          const normalizedStatus = updates.status
            ? normalizeTaskStatus(updates.status)
            : undefined;

          const normalizedUpdates = {
            ...updates,
            ...(normalizedStatus ? { status: normalizedStatus } : {}),
            ...(updates.tags ? { tags: dedupeTags(updates.tags) } : {}),
            ...(updates.projectIds ? { projectIds: dedupeProjectIds(updates.projectIds) } : {}),
          };
          
          const updatedTask = { ...t, ...normalizedUpdates };
          
          // Auto-archive logic
          if (
            normalizedStatus &&
            ARCHIVED_STATUSES.includes(normalizedStatus) && 
            !ARCHIVED_STATUSES.includes(t.status)
          ) {
            updatedTask.archived = true;
          }
          
          // Un-archive logic
          if (
            normalizedStatus &&
            ACTIVE_STATUSES.includes(normalizedStatus) && 
            ARCHIVED_STATUSES.includes(t.status)
          ) {
            updatedTask.archived = false;
          }

          return updatedTask;
        });

        queueCloudSave(get);
        return { tasks };
      }),

      deleteTask: (id) => set((state) => {
        const tasks = state.tasks.filter((t) => t.id !== id);
        queueCloudSave(get);
        return { tasks };
      }),

      reorderTasks: (newOrder) => set(() => {
        queueCloudSave(get);
        return { tasks: newOrder };
      }),

      addProject: (projectData) => {
        const repoUrl = projectData.repoUrl.trim();
        if (!repoUrl) {
          return "";
        }

        const normalizedKey = normalizeProjectUrlKey(repoUrl);
        let resolvedId = "";

        set((state) => {
          const existing = state.projects.find(
            (project) => normalizeProjectUrlKey(project.repoUrl) === normalizedKey,
          );

          if (existing) {
            resolvedId = existing.id;
            return state;
          }

          const id = nanoid();
          const name = getProjectNameFromUrl(repoUrl);
          resolvedId = id;

          return {
            projects: [...state.projects, { id, name, repoUrl }],
          };
        });

        queueCloudSave(get);

        return resolvedId;
      },

      updateProject: (id, projectData) => set((state) => {
        const repoUrl = projectData.repoUrl.trim();
        if (!repoUrl) {
          return state;
        }

        const normalizedKey = normalizeProjectUrlKey(repoUrl);
        const duplicate = state.projects.find(
          (project) =>
            project.id !== id &&
            normalizeProjectUrlKey(project.repoUrl) === normalizedKey,
        );

        if (duplicate) {
          return state;
        }

        const nextState = {
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  repoUrl,
                  name: getProjectNameFromUrl(repoUrl),
                }
              : project,
          ),
        };

        queueCloudSave(get);
        return nextState;
      }),

      deleteProject: (id) => set((state) => {
        const nextState = {
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.map(t => ({
            ...t,
            projectIds: t.projectIds.filter(pid => pid !== id)
          }))
        };
        queueCloudSave(get);
        return nextState;
      }),

      updateSettings: (updates) => set((state) => {
        const settings = { ...state.settings, ...updates };
        queueCloudSave(get);
        return { settings };
      }),

      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        queueCloudSave(get);
        return { theme: newTheme };
      }),

      setTheme: (theme) => set(() => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        queueCloudSave(get);
        return { theme };
      }),
    })
);

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function getLocalSnapshotKey(uid: string) {
  return `${LOCAL_SNAPSHOT_PREFIX}${uid}`;
}

function normalizeSnapshot(data?: Partial<CloudSnapshot>): CloudSnapshot {
  return {
    tasks: (data?.tasks || []).map((task) => ({
      ...task,
      status: normalizeTaskStatus(task.status),
      note: task.note || '',
      personalNote: task.personalNote || '',
      subtasks: task.subtasks || [],
      tags: dedupeTags(task.tags || []),
      projectIds: dedupeProjectIds(task.projectIds || []),
    })),
    projects: data?.projects || [],
    settings: {
      jiraBaseUrl: data?.settings?.jiraBaseUrl || '',
      emailStartText: data?.settings?.emailStartText || 'Daily Status Update:',
      emailEndText: data?.settings?.emailEndText || 'Thanks,',
      setupCompleted: data?.settings?.setupCompleted ?? true,
    },
    theme: data?.theme || 'system',
  };
}

function readLocalSnapshot(uid: string): CloudSnapshot | null {
  try {
    const raw = window.localStorage.getItem(getLocalSnapshotKey(uid));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CloudSnapshot>;
    return normalizeSnapshot(parsed);
  } catch {
    return null;
  }
}

function writeLocalSnapshot(uid: string, snapshot: CloudSnapshot) {
  try {
    window.localStorage.setItem(getLocalSnapshotKey(uid), JSON.stringify(snapshot));
  } catch {
    // Ignore local storage write errors.
  }
}

function applyTheme(theme: 'light' | 'dark' | 'system') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toCloudSnapshot(state: AppState): CloudSnapshot {
  return {
    tasks: state.tasks,
    projects: state.projects,
    settings: state.settings,
    theme: state.theme,
  };
}

function queueCloudSave(get: () => AppState) {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(async () => {
    const state = get();
    if (!state.userId) {
      return;
    }

    const snapshot = toCloudSnapshot(state);
    writeLocalSnapshot(state.userId, snapshot);

    if (!db) {
      return;
    }

    try {
      const nestedRef = doc(db, CLOUD_LEGACY_USERS_COLLECTION, state.userId, CLOUD_APP_STATE_COLLECTION, CLOUD_DOC_ID);
      await setDoc(nestedRef, {
        ...snapshot,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (nestedError) {
      console.warn('Primary Firestore path write failed, trying legacy path:', nestedError);
    }

    try {
      const legacyRef = doc(db, CLOUD_LEGACY_USERS_COLLECTION, state.userId);
      await setDoc(legacyRef, {
        ...snapshot,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (legacyError) {
      console.error('Failed to save cloud state to Firestore:', legacyError);
      // Keep local snapshot as fallback when cloud write fails.
    }
  }, 250);
}
