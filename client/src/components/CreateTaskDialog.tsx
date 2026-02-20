import { useState } from "react";
import { Plus } from "lucide-react";
import { useStore, type TaskStatus } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CREATE_PROJECT_VALUE = "__create_project__";
const TASK_STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Waiting for Info",
  "In Dev",
  "In Prod",
  "Closed",
  "Suspended",
];

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const { addTask, addProject, projects } = useStore();
  
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Not Started");
  const [selectedProject, setSelectedProject] = useState<string>("none");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");

  const handleProjectSelect = (value: string) => {
    if (value === CREATE_PROJECT_VALUE) {
      setIsAddingProject(true);
      return;
    }

    setSelectedProject(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as TaskStatus);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) {
      return;
    }

    const projectId = addProject({ repoUrl: newRepoUrl.trim() });

    setSelectedProject(projectId);
    setNewRepoUrl("");
    setIsAddingProject(false);
  };

  const parseTaskInput = (input: string) => {
    const trimmed = input.trim();
    const [firstToken, ...restTokens] = trimmed.split(/\s+/);

    return {
      jiraId: firstToken || "",
      parsedTitle: restTokens.join(" ").trim() || firstToken || "",
    };
  };

  const parseTagsInput = (input: string) =>
    Array.from(
      new Set(
        input
          .split(",")
          .map((tag) => tag.trim().replace(/^#/, ""))
          .filter(Boolean),
      ),
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { jiraId, parsedTitle } = parseTaskInput(title);

    if (!jiraId || !parsedTitle) {
      return;
    }

    addTask({
      jiraId,
      title: parsedTitle,
      status,
      note,
      tags: parseTagsInput(tagsInput),
      projectIds: selectedProject !== "none" ? [selectedProject] : [],
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setNote("");
    setTagsInput("");
    setStatus("Not Started");
    setSelectedProject("none");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your tracking board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="title" className="text-right">Task</Label>
            <Input
              id="title"
              placeholder="GAZZACTIVE-546 Inserimento Link sezione Gazzetta Active Family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((taskStatus) => (
                  <SelectItem key={taskStatus} value={taskStatus}>
                    {taskStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="project" className="text-right">Project</Label>
            <Select value={selectedProject} onValueChange={handleProjectSelect}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value={CREATE_PROJECT_VALUE}>+ Add Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-4 items-start">
            <Label htmlFor="note" className="text-right pt-2">Summary</Label>
            <Textarea
              id="note"
              placeholder="Daily summary for email..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 items-center">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <Input
              id="tags"
              placeholder="backend, urgent, release"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              Create a new project and it will be selected for this task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="newProjectRepo">Repo URL</Label>
              <Input
                id="newProjectRepo"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                placeholder="https://github.com/... or /Users/..."
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!newRepoUrl.trim()}>
                Add Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
