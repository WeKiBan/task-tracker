import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  PauseCircle, 
  MoreVertical,
  ExternalLink,
  Trash2,
  Archive,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, type Task, type TaskStatus } from "@/hooks/use-store";
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

const statusConfig: Record<TaskStatus, { icon: any, color: string, bg: string, border: string }> = {
  "Not Started": { 
    icon: Circle, 
    color: "text-status-gray", 
    bg: "bg-status-gray/10",
    border: "border-status-gray/20"
  },
  "In Progress": { 
    icon: PlayCircle, 
    color: "text-status-blue", 
    bg: "bg-status-blue/10",
    border: "border-status-blue/20"
  },
  "Completed": { 
    icon: CheckCircle2, 
    color: "text-status-green", 
    bg: "bg-status-green/10",
    border: "border-status-green/20"
  },
  "Suspended": { 
    icon: PauseCircle, 
    color: "text-status-amber", 
    bg: "bg-status-amber/10",
    border: "border-status-amber/20"
  },
};

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { updateTask, deleteTask, projects, settings, addProject } = useStore();
  const [newProjectName, setNewProjectName] = useState("");
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);

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
  
  const taskProjects = projects.filter(p => task.projectIds.includes(p.id));

  const jiraLink = settings.jiraBaseUrl 
    ? `${settings.jiraBaseUrl.replace(/\/$/, '')}/browse/${task.jiraId}`
    : null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName) {
      const id = addProject({ name: newProjectName, repoUrl: newRepoUrl });
      updateTask(task.id, { projectIds: [...task.projectIds, id] });
      setNewProjectName("");
      setNewRepoUrl("");
      setIsAddingProject(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground transition-all duration-200",
        "hover:border-primary/30",
        isDragging && "shadow-xl ring-1 ring-primary z-50 cursor-grabbing",
        task.archived && "opacity-60 bg-muted/20 grayscale-[0.5]"
      )}
    >
      <div className="flex items-start gap-2">
        {!task.archived && (
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {jiraLink ? (
                <a 
                  href={jiraLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
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
                  <button className={cn(
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
                      onClick={() => updateTask(task.id, { status })}
                      className="text-xs"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground/40 hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
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

          <Textarea
            value={task.note}
            onChange={(e) => updateTask(task.id, { note: e.target.value })}
            placeholder="Daily summary..."
            className="min-h-[44px] h-[44px] resize-none text-xs bg-muted/20 border-transparent hover:bg-muted/40 focus:bg-background focus:border-input transition-all p-2 rounded-md"
          />

          <div className="flex flex-wrap gap-1">
            {taskProjects.map(p => (
              <Badge 
                key={p.id} 
                variant="outline" 
                className="group/badge font-mono text-[9px] px-1.5 py-0 h-4 bg-background/50 border-border/40 text-muted-foreground gap-1"
              >
                {p.repoUrl ? (
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-0.5">
                    {p.name}
                  </a>
                ) : p.name}
                <button 
                  onClick={() => updateTask(task.id, { projectIds: task.projectIds.filter(id => id !== p.id) })}
                  className="opacity-0 group-hover/badge:opacity-100 hover:text-destructive transition-opacity"
                >
                  <Trash2 className="w-2 h-2" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* New Project Modal (Nested to avoid global state mess) */}
      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-sm">New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Name</Label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase">Repo URL</Label>
              <Input
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="h-8 text-xs"
                placeholder="https://github.com/..."
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
