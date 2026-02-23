import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocation } from "wouter";
import { 
  GripVertical, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  PauseCircle, 
  Code2,
  Rocket,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Trash2,
  Archive,
  Bold,
  Italic,
  Underline
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, isLocalProjectPath, normalizeProjectUrlKey, type Task, type TaskStatus } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (taskId: string) => void;
}

const PROJECT_SELECT_NONE = "__none__";
const PROJECT_SELECT_ADD_NEW = "__add_new__";

const statusConfig: Record<TaskStatus, { icon: any, color: string, bg: string, border: string, accent: string }> = {
  "Not Started": { 
    icon: Circle, 
    color: "text-status-gray", 
    bg: "bg-status-gray/10",
    border: "border-status-gray/20",
    accent: "bg-status-gray"
  },
  "In Progress": { 
    icon: PlayCircle, 
    color: "text-status-blue", 
    bg: "bg-status-blue/10",
    border: "border-status-blue/20",
    accent: "bg-status-blue"
  },
  "Waiting for Info": {
    icon: AlertCircle,
    color: "text-status-amber",
    bg: "bg-status-amber/10",
    border: "border-status-amber/20",
    accent: "bg-status-amber",
  },
  "In Dev": {
    icon: Code2,
    color: "text-status-purple",
    bg: "bg-status-purple/10",
    border: "border-status-purple/20",
    accent: "bg-status-purple",
  },
  "In Prod": {
    icon: Rocket,
    color: "text-status-teal",
    bg: "bg-status-teal/10",
    border: "border-status-teal/20",
    accent: "bg-status-teal",
  },
  "Closed": { 
    icon: CheckCircle2, 
    color: "text-status-green", 
    bg: "bg-status-green/10",
    border: "border-status-green/20",
    accent: "bg-status-green"
  },
  "Suspended": { 
    icon: PauseCircle, 
    color: "text-status-red", 
    bg: "bg-status-red/10",
    border: "border-status-red/20",
    accent: "bg-status-red"
  },
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sanitizeNoteHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/ on\w+=\"[^\"]*\"/gi, "")
    .replace(/ on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

const toEditorHtml = (note: string) => {
  const trimmed = (note || "").trim();
  if (!trimmed) {
    return "";
  }

  const looksLikeHtml = /<[^>]+>/.test(trimmed);
  if (looksLikeHtml) {
    return sanitizeNoteHtml(trimmed);
  }

  return escapeHtml(note).replace(/\n/g, "<br />");
};

export function TaskCard({ task, isOverlay, selectionMode = false, isSelected = false, onToggleSelect }: TaskCardProps) {
  const { updateTask, deleteTask, projects, settings, addProject } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedProjectToAdd, setSelectedProjectToAdd] = useState(PROJECT_SELECT_NONE);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isPickingProjectFolder, setIsPickingProjectFolder] = useState(false);
  const [isGeneratingProjectComment, setIsGeneratingProjectComment] = useState(false);
  const [generatedProjectComment, setGeneratedProjectComment] = useState("");
  const preventReopenRef = useRef(false);
  const personalNoteEditorRef = useRef<HTMLDivElement>(null);
  const personalNoteDraftRef = useRef(toEditorHtml(task.personalNote || ""));
  const lastSavedPersonalNoteRef = useRef(task.personalNote || "");
  const personalNoteSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isTaskOpen) {
      return;
    }

    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }

    const nextValue = toEditorHtml(task.personalNote || "");
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }

    personalNoteDraftRef.current = nextValue;
    lastSavedPersonalNoteRef.current = task.personalNote || "";
  }, [isTaskOpen, task.personalNote]);

  useEffect(() => {
    return () => {
      if (personalNoteSaveTimerRef.current) {
        clearTimeout(personalNoteSaveTimerRef.current);
      }
    };
  }, []);

  const suppressCardOpenTemporarily = () => {
    preventReopenRef.current = true;
    setTimeout(() => {
      preventReopenRef.current = false;
    }, 200);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isOverlay || task.archived });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const StatusIcon = statusConfig[task.status].icon;
  const statusStyle = statusConfig[task.status];
  const taskTags = task.tags || [];
  
  const taskProjects = projects.filter(p => task.projectIds.includes(p.id));

  const jiraIdFromTitle = task.title.trim().split(/\s+/)[0] || "";
  const jiraKey = jiraIdFromTitle.includes("-") ? jiraIdFromTitle : task.jiraId;

  const jiraLink = settings.jiraBaseUrl 
    ? `${settings.jiraBaseUrl.replace(/\/$/, '')}/${jiraKey}`
    : null;

  const getJiraLink = (jiraId: string) =>
    settings.jiraBaseUrl ? `${settings.jiraBaseUrl.replace(/\/$/, "")}/${jiraId}` : null;

  const pickProjectFolder = async () => {
    setIsPickingProjectFolder(true);
    try {
      const response = await fetch("/api/pick-project-folder");
      const payload = (await response.json().catch(() => ({}))) as { path?: string; message?: string; detail?: string };

      if (!response.ok) {
        window.alert(payload.message || "Unable to open folder picker. You can paste a local path manually.");
        return;
      }

      if (payload.path) {
        setNewRepoUrl(payload.path);
        setIsAddingProject(true);
        return;
      }

      window.alert("No folder was selected.");
    } catch {
      window.alert("Folder picker is unavailable here. Run the app locally and try again, or paste a local path manually.");
    } finally {
      setIsPickingProjectFolder(false);
    }
  };

  const openProjectInEditor = (target: string) => {
    const trimmed = target.trim();
    if (!trimmed) {
      return;
    }

    if (isLocalProjectPath(trimmed)) {
      // Use vscode:// protocol URI so it works from any browser (local or deployed).
      // The browser asks the OS to open VS Code on the user's local machine.
      const vsCodeUri = `vscode://file${trimmed.startsWith("/") ? "" : "/"}${encodeURI(trimmed)}`;
      // Use a hidden iframe first (works best in Chrome/Edge), fall back to location.href
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = vsCodeUri;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
      // Also try location.href as a fallback for Safari/Firefox
      setTimeout(() => {
        window.location.href = vsCodeUri;
      }, 100);
      return;
    }

    // For remote URLs (GitHub, GitLab, etc.), open in a new browser tab
    try {
      const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      window.alert("Unable to open project URL.");
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRepoUrl.trim()) {
      const normalizedNewProject = normalizeProjectUrlKey(newRepoUrl);
      const existingProject = projects.find(
        (project) => normalizeProjectUrlKey(project.repoUrl) === normalizedNewProject,
      );

      if (existingProject) {
        if (!task.projectIds.includes(existingProject.id)) {
          updateTask(task.id, { projectIds: [...task.projectIds, existingProject.id] });
        }
        setSelectedProjectToAdd(existingProject.id);
        setNewRepoUrl("");
        setIsAddingProject(false);
        window.alert("Project already exists. Selected the existing project instead.");
        return;
      }

      const id = addProject({ repoUrl: newRepoUrl.trim() });
      if (id && !task.projectIds.includes(id)) {
        updateTask(task.id, { projectIds: [...task.projectIds, id] });
      }
      setNewRepoUrl("");
      setIsAddingProject(false);
    }
  };

  const toggleTaskProject = (projectId: string) => {
    const newIds = task.projectIds.includes(projectId)
      ? task.projectIds.filter((id) => id !== projectId)
      : [...task.projectIds, projectId];

    updateTask(task.id, { projectIds: newIds });
  };

  const handleProjectSelectInTask = (value: string) => {
    setSelectedProjectToAdd(value);

    if (value === PROJECT_SELECT_ADD_NEW) {
      setIsAddingProject(true);
      return;
    }

    if (value === PROJECT_SELECT_NONE) {
      setIsAddingProject(false);
      return;
    }

    if (!task.projectIds.includes(value)) {
      updateTask(task.id, { projectIds: [...task.projectIds, value] });
    }

    setIsAddingProject(false);
    setSelectedProjectToAdd(PROJECT_SELECT_NONE);
  };

  const generateProjectComment = async () => {
    if (taskProjects.length === 0) {
      setGeneratedProjectComment("Projects modified:\n\nNo projects assigned.");
      return;
    }

    setIsGeneratingProjectComment(true);
    try {
      const response = await fetch("/api/projects/generate-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projects: taskProjects.map((project) => ({
            name: project.name,
            repoUrl: project.repoUrl,
          })),
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setGeneratedProjectComment(
          "Generate Comment API is unavailable. Restart the local dev server and try again.",
        );
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        comment?: string;
        message?: string;
      };

      if (!response.ok) {
        setGeneratedProjectComment(payload.message || "Unable to generate comment.");
        return;
      }

      setGeneratedProjectComment(payload.comment || "Projects modified:\n\nNo data generated.");
    } catch {
      setGeneratedProjectComment("Unable to generate comment. Run the app locally and try again.");
    } finally {
      setIsGeneratingProjectComment(false);
    }
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isOverlay) {
      return;
    }

    if (preventReopenRef.current) {
      return;
    }

    if (selectionMode) {
      event.preventDefault();
      onToggleSelect?.(task.id);
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("[data-no-open-task='true']")) {
      return;
    }
    setLocation(`/task/${task.id}`);
  };

  const handleTaskOpenChange = (open: boolean) => {
    if (!open) {
      savePersonalNote();
      suppressCardOpenTemporarily();
    }

    setIsTaskOpen(open);
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().replace(/^#/, "");
    if (!tag) {
      return;
    }

    if (taskTags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setNewTagInput("");
      return;
    }

    updateTask(task.id, { tags: [...taskTags, tag] });
    setNewTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    updateTask(task.id, {
      tags: taskTags.filter((tag) => tag.toLowerCase() !== tagToRemove.toLowerCase()),
    });
  };

  const syncPersonalNoteFromEditor = () => {
    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }

    const nextValue = editor.innerHTML;
    personalNoteDraftRef.current = nextValue;
    queuePersonalNoteSave(nextValue);
  };

  const persistPersonalNote = (rawValue: string) => {
    const sanitized = sanitizeNoteHtml(rawValue).trim();
    personalNoteDraftRef.current = sanitized;

    if (sanitized === lastSavedPersonalNoteRef.current) {
      return;
    }

    updateTask(task.id, { personalNote: sanitized });
    lastSavedPersonalNoteRef.current = sanitized;
  };

  const queuePersonalNoteSave = (rawValue: string) => {
    if (personalNoteSaveTimerRef.current) {
      clearTimeout(personalNoteSaveTimerRef.current);
    }

    personalNoteSaveTimerRef.current = setTimeout(() => {
      persistPersonalNote(rawValue);
    }, 180);
  };

  const savePersonalNote = () => {
    if (personalNoteSaveTimerRef.current) {
      clearTimeout(personalNoteSaveTimerRef.current);
      personalNoteSaveTimerRef.current = null;
    }

    const editor = personalNoteEditorRef.current;
    const currentValue = editor ? editor.innerHTML : personalNoteDraftRef.current;
    persistPersonalNote(currentValue);
  };

  const applyPersonalNoteFormat = (command: "bold" | "italic" | "underline") => {
    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();
    document.execCommand(command, false);
    const nextValue = editor.innerHTML;
    personalNoteDraftRef.current = nextValue;
    queuePersonalNoteSave(nextValue);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className={cn(
        "group relative overflow-hidden flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground transition-all duration-200 cursor-pointer",
        "hover:border-primary/30",
        "hover:shadow-md hover:-translate-y-[1px]",
        selectionMode && "select-none",
        selectionMode && isSelected && "ring-2 ring-primary border-primary/60 bg-primary/5",
        selectionMode && "[&_button]:pointer-events-none [&_a]:pointer-events-none [&_textarea]:pointer-events-none",
        isDragging && "shadow-xl ring-1 ring-primary z-50 cursor-grabbing",
        task.archived && "opacity-60 bg-muted/20 grayscale-[0.5]"
      )}
    >
      <span
        aria-hidden
        className={cn("absolute left-0 top-0 h-full w-1.5 rounded-l-lg", statusStyle.accent)}
      />
      <ChevronRight
        aria-hidden
        className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none transition-transform group-hover:translate-x-0.5"
      />

      <div className="flex items-start gap-2">
        {!task.archived && (
          selectionMode ? (
            <span
              aria-hidden
              className={cn(
                "mt-1 p-1 flex items-center justify-center",
                isSelected ? "text-primary" : "text-muted-foreground/60",
              )}
            >
              {isSelected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            </span>
          ) : (
            <button
              {...attributes}
              {...listeners}
              data-no-open-task="true"
              className="mt-1 p-1 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
          )
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", statusStyle.accent)} />
              {jiraLink ? (
                <a 
                  href={jiraLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-no-open-task="true"
                  className="font-mono text-[10px] font-bold text-primary hover:underline bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 flex items-center gap-1 shrink-0"
                >
                  {task.jiraId}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  {task.jiraId}
                </span>
              )}
              <h3 className="font-semibold text-sm leading-tight truncate">
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    data-no-open-task="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      suppressCardOpenTemporarily();
                    }}
                    className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors hover:brightness-95",
                    statusStyle.color,
                    statusStyle.bg,
                    statusStyle.border
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {task.status}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={(e) => {
                        e.stopPropagation();
                        suppressCardOpenTemporarily();
                        updateTask(task.id, { status });
                      }}
                      className="text-xs"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    data-no-open-task="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      suppressCardOpenTemporarily();
                    }}
                    className="text-muted-foreground/40 hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <MoreVertical className="h-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.stopPropagation();
                      suppressCardOpenTemporarily();
                      const previousArchived = task.archived;
                      const nextArchived = !task.archived;
                      updateTask(task.id, { archived: nextArchived });
                      toast({
                        title: nextArchived ? "Task has been archived" : "Task has been unarchived",
                        action: (
                          <ToastAction
                            altText={nextArchived ? "Undo archive" : "Undo unarchive"}
                            onClick={() => updateTask(task.id, { archived: previousArchived })}
                          >
                            Undo
                          </ToastAction>
                        ),
                      });
                    }}
                    className="text-xs"
                  >
                    <Archive className="h-3 w-3 mr-2" />
                    {task.archived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.stopPropagation();
                      suppressCardOpenTemporarily();
                      deleteTask(task.id);
                    }}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-2">
            <Input
              data-no-open-task="true"
              value={task.note}
              onChange={(e) => updateTask(task.id, { note: e.target.value })}
              placeholder="Daily summary..."
              className="w-full max-w-[94%] h-8 text-xs font-bold border border-input bg-background/70 hover:bg-background focus:bg-background focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition-all px-2 rounded-md"
              maxLength={120}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {taskProjects.map(p => (
              <Badge 
                key={p.id} 
                variant="outline" 
                className="group/badge font-mono text-[9px] px-1.5 py-0 h-4 bg-background/50 border-border/40 text-muted-foreground gap-1"
              >
                {p.repoUrl ? (
                  <button
                    type="button"
                    data-no-open-task="true"
                    onClick={() => openProjectInEditor(p.repoUrl)}
                    className="hover:text-primary flex items-center gap-0.5"
                    title="Open project in VS Code"
                  >
                    {p.name}
                  </button>
                ) : p.name}
                <button 
                  data-no-open-task="true"
                  onClick={() => updateTask(task.id, { projectIds: task.projectIds.filter(id => id !== p.id) })}
                  className="opacity-0 group-hover/badge:opacity-100 hover:text-destructive transition-opacity"
                >
                  <Trash2 className="w-2 h-2" />
                </button>
              </Badge>
            ))}
          </div>

          {taskTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {taskTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[9px] px-1.5 py-0 h-4"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
