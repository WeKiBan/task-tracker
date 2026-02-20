import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  Plus,
  Bold,
  Italic,
  Underline,
  ImagePlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, type Subtask, type Task, type TaskStatus } from "@/hooks/use-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

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

const readImageAsOptimizedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read image"));
        return;
      }

      const originalDataUrl = reader.result;

      const image = new Image();
      image.onload = () => {
        const maxWidth = 1400;
        const scale = image.width > maxWidth ? maxWidth / image.width : 1;
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          resolve(originalDataUrl);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        const optimized = canvas.toDataURL("image/jpeg", 0.82);
        resolve(optimized || originalDataUrl);
      };

      image.onerror = () => resolve(originalDataUrl);
      image.src = originalDataUrl;
    };

    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { updateTask, deleteTask, projects, settings, addProject } = useStore();
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const [selectedImageWidth, setSelectedImageWidth] = useState<number | null>(null);
  const preventReopenRef = useRef(false);
  const personalNoteEditorRef = useRef<HTMLDivElement>(null);
  const personalNoteImageInputRef = useRef<HTMLInputElement>(null);
  const personalNoteDraftRef = useRef(toEditorHtml(task.personalNote || ""));
  const lastSavedPersonalNoteRef = useRef(task.personalNote || "");
  const personalNoteSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);

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

  const getProjectOpenLink = (repoOrPath: string) => {
    const trimmed = repoOrPath.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.startsWith("vscode://")) {
      return trimmed;
    }

    const localPathPattern = /^(~\/|\/|[A-Za-z]:[\\/]|\\\\)/;
    if (localPathPattern.test(trimmed)) {
      const normalized = trimmed.replace(/\\/g, "/");
      return `vscode://file/${encodeURI(normalized)}`;
    }

    const gitLikeUrlPattern = /^(https?:\/\/|git@|ssh:\/\/)/i;
    if (gitLikeUrlPattern.test(trimmed)) {
      return `vscode://vscode.git/clone?url=${encodeURIComponent(trimmed)}`;
    }

    return trimmed;
  };

  const parseSubtaskInput = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const [firstToken, ...restTokens] = trimmed.split(/\s+/);
    const jiraId = firstToken || "";
    const title = restTokens.join(" ").trim() || firstToken || "";

    if (!jiraId || !title) {
      return null;
    }

    return { jiraId, title };
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRepoUrl.trim()) {
      const id = addProject({ repoUrl: newRepoUrl.trim() });
      if (id && !task.projectIds.includes(id)) {
        updateTask(task.id, { projectIds: [...task.projectIds, id] });
      }
      setNewRepoUrl("");
      setIsAddingProject(false);
    }
  };

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isOverlay) {
      return;
    }

    if (preventReopenRef.current || isTaskOpen) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("[data-no-open-task='true']")) {
      return;
    }
    setIsTaskOpen(true);
  };

  const handleTaskOpenChange = (open: boolean) => {
    if (!open) {
      savePersonalNote();
      suppressCardOpenTemporarily();
      selectedImageRef.current = null;
      setSelectedImageWidth(null);
    }

    setIsTaskOpen(open);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseSubtaskInput(newSubtaskInput);
    if (!parsed) {
      return;
    }

    const subtask: Subtask = {
      id: crypto.randomUUID(),
      jiraId: parsed.jiraId,
      title: parsed.title,
    };

    updateTask(task.id, { subtasks: [...task.subtasks, subtask] });
    setNewSubtaskInput("");
  };

  const removeSubtask = (subtaskId: string) => {
    updateTask(task.id, {
      subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
    });
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

  const insertImageIntoPersonalNote = (dataUrl: string) => {
    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${dataUrl}" alt="Screenshot" style="width:100%;max-width:100%;height:auto;border-radius:8px;margin:8px 0;cursor:pointer;" />`,
    );
    const nextValue = editor.innerHTML;
    personalNoteDraftRef.current = nextValue;
    persistPersonalNote(nextValue);
  };

  const setSelectedImageSize = (widthPercent: number) => {
    const selectedImage = selectedImageRef.current;
    if (!selectedImage) {
      return;
    }

    selectedImage.style.width = `${widthPercent}%`;
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";
    setSelectedImageWidth(widthPercent);
    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }
    const nextValue = editor.innerHTML;
    personalNoteDraftRef.current = nextValue;
    persistPersonalNote(nextValue);
  };

  const removeSelectedImage = () => {
    const selectedImage = selectedImageRef.current;
    if (!selectedImage) {
      return;
    }

    selectedImage.remove();
    selectedImageRef.current = null;
    setSelectedImageWidth(null);
    const editor = personalNoteEditorRef.current;
    if (!editor) {
      return;
    }
    const nextValue = editor.innerHTML;
    personalNoteDraftRef.current = nextValue;
    persistPersonalNote(nextValue);
  };

  const handlePersonalNoteEditorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const image = target.closest("img") as HTMLImageElement | null;

    if (!image) {
      selectedImageRef.current = null;
      setSelectedImageWidth(null);
      return;
    }

    selectedImageRef.current = image;

    const widthValue = image.style.width;
    const parsed = widthValue.endsWith("%") ? Number.parseFloat(widthValue) : 100;
    setSelectedImageWidth(Number.isFinite(parsed) ? parsed : 100);
  };

  const handlePersonalNoteImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    try {
      const optimizedDataUrl = await readImageAsOptimizedDataUrl(file);
      insertImageIntoPersonalNote(optimizedDataUrl);
    } catch {
      // ignore image read errors
    }

    event.target.value = "";
  };

  const handlePersonalNotePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(event.clipboardData.files || []);
    const image = files.find((file) => file.type.startsWith("image/"));

    if (!image) {
      return;
    }

    event.preventDefault();

    try {
      const optimizedDataUrl = await readImageAsOptimizedDataUrl(image);
      insertImageIntoPersonalNote(optimizedDataUrl);
    } catch {
      // ignore image read errors
    }
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
          <button
            {...attributes}
            {...listeners}
            data-no-open-task="true"
            className="mt-1 p-1 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
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
                  <button data-no-open-task="true" className="text-muted-foreground/40 hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                    <MoreVertical className="h-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-wider opacity-50">Projects</DropdownMenuLabel>
                  <div className="max-h-40 overflow-y-auto">
                    {projects.map(p => (
                      <DropdownMenuItem
                        key={p.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          const newIds = task.projectIds.includes(p.id)
                            ? task.projectIds.filter(id => id !== p.id)
                            : [...task.projectIds, p.id];
                          updateTask(task.id, { projectIds: newIds });
                        }}
                        className="text-xs"
                      >
                        <div className={cn(
                          "w-3 h-3 mr-2 rounded-sm border flex items-center justify-center shrink-0",
                          task.projectIds.includes(p.id) ? "bg-primary border-primary" : "border-muted-foreground"
                        )}>
                          {task.projectIds.includes(p.id) && <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <span className="truncate">{p.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsAddingProject(true);
                    }}
                    className="text-xs font-medium text-primary"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    New Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => updateTask(task.id, { archived: !task.archived })}
                    className="text-xs"
                  >
                    <Archive className="h-3 w-3 mr-2" />
                    {task.archived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTask(task.id)}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Daily Summary
            </p>
            <Textarea
              data-no-open-task="true"
              value={task.note}
              onChange={(e) => updateTask(task.id, { note: e.target.value })}
              placeholder="Add your daily summary here..."
              className="w-full max-w-[94%] min-h-[56px] h-[56px] resize-none text-xs border border-input bg-background/70 hover:bg-background focus:bg-background focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition-all p-2 rounded-md"
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
                  <a
                    data-no-open-task="true"
                    href={getProjectOpenLink(p.repoUrl) || p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center gap-0.5"
                    title="Open project in VS Code"
                  >
                    {p.name}
                  </a>
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

      <Dialog open={isTaskOpen} onOpenChange={handleTaskOpenChange}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="text-base">{task.jiraId} {task.title}</DialogTitle>
            <DialogDescription>
              Manage subtasks and personal notes for this task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Daily Summary (included in email)</Label>
              <Textarea
                value={task.note}
                onChange={(e) => updateTask(task.id, { note: e.target.value })}
                className="min-h-[80px] text-sm"
                placeholder="What did you do today on this task?"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Personal Notes (not included in email)</Label>
              <div className="rounded-md border bg-background">
                <div className="flex items-center gap-1 border-b p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => applyPersonalNoteFormat("bold")}
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => applyPersonalNoteFormat("italic")}
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => applyPersonalNoteFormat("underline")}
                  >
                    <Underline className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => personalNoteImageInputRef.current?.click()}
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="ml-1 text-[10px] text-muted-foreground">Paste screenshots or upload image</span>
                </div>

                <div
                  ref={personalNoteEditorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncPersonalNoteFromEditor}
                  onBlur={savePersonalNote}
                  onPaste={handlePersonalNotePaste}
                  onClick={handlePersonalNoteEditorClick}
                  data-placeholder="Private notes, reminders, links, screenshots..."
                  className="min-h-[140px] p-3 text-sm outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/70 [&_img]:max-w-full [&_img]:rounded-md [&_img]:my-2 [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
                />

                {selectedImageWidth !== null && (
                  <div className="flex items-center gap-1 border-t p-2">
                    <span className="text-[10px] text-muted-foreground mr-1">Image size</span>
                    {[25, 50, 75, 100].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={selectedImageWidth === size ? "default" : "outline"}
                        size="sm"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => setSelectedImageSize(size)}
                      >
                        {size}%
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-destructive"
                      onClick={removeSelectedImage}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <input
                  ref={personalNoteImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePersonalNoteImageSelect}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase">Subtasks</Label>
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <Input
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  placeholder="SUB-123 Subtask title"
                />
                <Button type="submit" size="sm" disabled={!newSubtaskInput.trim()}>
                  Add
                </Button>
              </form>

              <div className="max-h-52 overflow-y-auto space-y-2 rounded-md border p-2">
                {task.subtasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No subtasks yet.</p>
                ) : (
                  task.subtasks.map((subtask) => {
                    const subtaskLink = getJiraLink(subtask.jiraId);

                    return (
                      <div key={subtask.id} className="flex items-center justify-between gap-2 rounded border p-2">
                        <div className="min-w-0 flex items-center gap-2">
                          {subtaskLink ? (
                            <a
                              href={subtaskLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] font-bold text-primary hover:underline bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 shrink-0"
                            >
                              {subtask.jiraId}
                            </a>
                          ) : (
                            <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                              {subtask.jiraId}
                            </span>
                          )}
                          <span className="text-sm truncate">{subtask.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeSubtask(subtask.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase">Tags</Label>
              <form onSubmit={addTag} className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="urgent"
                />
                <Button type="submit" size="sm" disabled={!newTagInput.trim()}>
                  Add
                </Button>
              </form>

              <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-10">
                {taskTags.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No tags yet.</p>
                ) : (
                  taskTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        className="hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Modal (Nested to avoid global state mess) */}
      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-sm">New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Repo URL</Label>
              <Input
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="h-8 text-xs"
                placeholder="https://github.com/... or /Users/..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" size="sm" className="w-full">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
