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
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore, type Task, type TaskStatus } from "@/hooks/use-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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
  const { updateTask, deleteTask, projects } = useStore();
  const [isEditingNote, setIsEditingNote] = useState(false);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col gap-3 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isDragging && "shadow-xl ring-2 ring-primary rotate-2 z-50 cursor-grabbing",
        task.archived && "opacity-75 bg-muted/30 border-dashed"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle - Only show if not archived */}
        {!task.archived && (
          <button
            {...attributes}
            {...listeners}
            className="mt-1 -ml-1 p-1 text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {task.jiraId}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors hover:bg-background",
                    statusStyle.color,
                    statusStyle.bg,
                    statusStyle.border
                  )}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {task.status}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => updateTask(task.id, { status })}
                      className="gap-2"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-muted-foreground/50 hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                {projects.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">No projects created</div>
                ) : (
                  projects.map(p => (
                    <DropdownMenuItem
                      key={p.id}
                      onClick={() => {
                        const newIds = task.projectIds.includes(p.id)
                          ? task.projectIds.filter(id => id !== p.id)
                          : [...task.projectIds, p.id];
                        updateTask(task.id, { projectIds: newIds });
                      }}
                    >
                      <div className={cn(
                        "w-4 h-4 mr-2 rounded border flex items-center justify-center",
                        task.projectIds.includes(p.id) ? "bg-primary border-primary" : "border-muted-foreground"
                      )}>
                        {task.projectIds.includes(p.id) && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      {p.name}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => updateTask(task.id, { archived: !task.archived })}
                  className="gap-2"
                >
                  <Archive className="h-4 w-4" />
                  {task.archived ? "Unarchive" : "Archive"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="font-semibold text-base leading-tight mb-2 truncate">
            {task.title}
          </h3>

          <Textarea
            value={task.note}
            onChange={(e) => updateTask(task.id, { note: e.target.value })}
            placeholder="Add notes..."
            className="min-h-[60px] resize-none text-sm bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-input transition-colors mb-2"
          />

          {taskProjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {taskProjects.map(p => (
                <Badge 
                  key={p.id} 
                  variant="secondary" 
                  className="font-normal text-xs px-2 py-0 h-5 bg-background border border-border/50 text-muted-foreground"
                >
                  {p.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
