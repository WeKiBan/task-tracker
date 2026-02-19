import { useRef, useState } from "react";
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
  Plus
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

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { updateTask, deleteTask, projects, settings, addProject } = useStore();
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");
  const preventReopenRef = useRef(false);

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
      suppressCardOpenTemporarily();
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
                  <a data-no-open-task="true" href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-0.5">
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
              <Textarea
                value={task.personalNote || ""}
                onChange={(e) => updateTask(task.id, { personalNote: e.target.value })}
                className="min-h-[90px] text-sm"
                placeholder="Private notes, reminders, links, etc."
              />
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
                placeholder="https://github.com/..."
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
