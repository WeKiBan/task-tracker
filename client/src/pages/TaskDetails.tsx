import { useEffect, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Bold, Italic, Underline, List, Trash2, ExternalLink, Check } from "lucide-react";
import { nanoid } from "nanoid";

import { useStore, isLocalProjectPath, normalizeProjectUrlKey } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROJECT_SELECT_NONE = "__none__";
const PROJECT_SELECT_ADD_NEW = "__add_new__";

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

export default function TaskDetails() {
  const [, params] = useRoute<{ id: string }>("/task/:id");
  const [, setLocation] = useLocation();

  const { tasks, projects, settings, updateTask, addProject } = useStore();
  const task = tasks.find((entry) => entry.id === params?.id);

  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedProjectToAdd, setSelectedProjectToAdd] = useState(PROJECT_SELECT_NONE);
  const [isPickingProjectFolder, setIsPickingProjectFolder] = useState(false);
  const [isGeneratingProjectComment, setIsGeneratingProjectComment] = useState(false);
  const [generatedProjectComment, setGeneratedProjectComment] = useState("");
  const [newTodoInput, setNewTodoInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [reminderAtInput, setReminderAtInput] = useState("");
  const [reminderMessageInput, setReminderMessageInput] = useState("");

  const personalNoteEditorRef = useRef<HTMLDivElement>(null);
  const personalNoteDraftRef = useRef("");
  const lastSavedPersonalNoteRef = useRef("");
  const personalNoteSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!task) {
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
  }, [task?.personalNote, task?.id]);

  useEffect(() => {
    return () => {
      if (personalNoteSaveTimerRef.current) {
        clearTimeout(personalNoteSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!task) {
      return;
    }

    setDeadlineInput(task.dueDate || "");
  }, [task?.id, task?.dueDate]);

  if (!task) {
    return (
      <main className="min-h-screen bg-background text-foreground p-4">
        <div className="container max-w-3xl mx-auto space-y-4">
          <Button variant="outline" size="sm" onClick={() => setLocation("/")}> 
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <p className="text-sm text-muted-foreground">Task not found.</p>
        </div>
      </main>
    );
  }

  const taskTags = task.tags || [];
  const taskTodos = task.todos || [];
  const taskReminders = task.reminders || [];
  const taskProjects = projects.filter((project) => task.projectIds.includes(project.id));
  const jiraLink = settings.jiraBaseUrl
    ? `${settings.jiraBaseUrl.replace(/\/$/, "")}/${task.jiraId}`
    : null;

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

  const applyPersonalNoteFormat = (command: "bold" | "italic" | "underline" | "insertUnorderedList") => {
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

  const pickProjectFolder = async () => {
    setIsPickingProjectFolder(true);
    try {
      const response = await fetch("/api/pick-project-folder");
      const payload = (await response.json().catch(() => ({}))) as { path?: string; message?: string };

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

  const openProjectInEditor = async (target: string) => {
    const trimmed = target.trim();
    if (!trimmed) {
      return;
    }

    if (isLocalProjectPath(trimmed)) {
      try {
        const response = await fetch("/api/open-project-in-vscode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ target: trimmed }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { message?: string };
          window.alert(payload.message || "Unable to open project in a new VS Code window.");
        }
      } catch {
        window.alert("Unable to open project in a new VS Code window.");
      }
      return;
    }

    window.alert("Only local machine project paths are supported.");
  };

  const handleCreateProject = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newRepoUrl.trim()) {
      return;
    }

    if (!isLocalProjectPath(newRepoUrl)) {
      window.alert("Please provide a local folder path (for example: /Users/you/project).");
      return;
    }

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

  const addTag = (event: React.FormEvent) => {
    event.preventDefault();
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

  const addTodoItem = (event: React.FormEvent) => {
    event.preventDefault();
    const text = newTodoInput.trim();
    if (!text) {
      return;
    }

    updateTask(task.id, {
      todos: [...taskTodos, { id: crypto.randomUUID(), text, done: false }],
    });
    setNewTodoInput("");
  };

  const toggleTodoItem = (todoId: string) => {
    updateTask(task.id, {
      todos: taskTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              done: !todo.done,
            }
          : todo,
      ),
    });
  };

  const removeTodoItem = (todoId: string) => {
    updateTask(task.id, {
      todos: taskTodos.filter((todo) => todo.id !== todoId),
    });
  };

  const addDeadline = () => {
    if (!deadlineInput) {
      return;
    }

    updateTask(task.id, { dueDate: deadlineInput });
  };

  const removeDeadline = () => {
    updateTask(task.id, { dueDate: "" });
    setDeadlineInput("");
  };

  const addReminder = (event: React.FormEvent) => {
    event.preventDefault();

    if (!reminderAtInput) {
      return;
    }

    const reminderToAdd = {
      id: nanoid(),
      at: reminderAtInput,
      message: reminderMessageInput.trim(),
    };

    const nextReminders = [
      ...taskReminders,
      reminderToAdd,
    ];

    updateTask(task.id, { reminders: nextReminders });
    setReminderAtInput("");
    setReminderMessageInput("");
  };

  const removeReminder = (reminderId: string) => {
    updateTask(task.id, {
      reminders: taskReminders.filter((reminder) => reminder.id !== reminderId),
    });
  };

  const sortedReminders = [...taskReminders].sort((a, b) => a.at.localeCompare(b.at));

  const formatReminderDate = (value: string) => {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="container max-w-3xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setLocation("/")}> 
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to tasks
          </Button>
          {jiraLink ? (
            <a href={jiraLink} target="_blank" rel="noopener noreferrer">
              <Badge variant="outline" className="font-mono hover:text-primary flex items-center gap-1">
                {task.jiraId}
                <ExternalLink className="h-3 w-3" />
              </Badge>
            </a>
          ) : (
            <Badge variant="outline" className="font-mono">{task.jiraId}</Badge>
          )}
        </div>

        <div className="rounded-lg border bg-card text-card-foreground p-4 space-y-4 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold leading-tight">{task.title}</h1>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] uppercase">Daily Summary (included in email)</Label>
            <Textarea
              value={task.note}
              onChange={(e) => updateTask(task.id, { note: e.target.value })}
              className="min-h-[100px] text-sm"
              placeholder="What did you do today on this task?"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Task Todo List</Label>
            <form onSubmit={addTodoItem} className="flex gap-2">
              <Input
                value={newTodoInput}
                onChange={(e) => setNewTodoInput(e.target.value)}
                placeholder="Add next action..."
              />
              <Button type="submit" size="sm" disabled={!newTodoInput.trim()}>
                Add
              </Button>
            </form>
            <div className="rounded-md border p-2 space-y-2 min-h-10">
              {taskTodos.length === 0 ? (
                <p className="text-xs text-muted-foreground">No todo items yet.</p>
              ) : (
                taskTodos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 rounded-md border bg-background/70 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => toggleTodoItem(todo.id)}
                      className={`h-5 w-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
                        todo.done
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-transparent hover:border-primary/50"
                      }`}
                      aria-label={todo.done ? "Mark todo incomplete" : "Mark todo complete"}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleTodoItem(todo.id)}
                      className={`text-left text-sm flex-1 ${todo.done ? "line-through text-muted-foreground" : ""}`}
                    >
                      {todo.text}
                    </button>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeTodoItem(todo.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Deadline</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                className="h-8 text-xs"
              />
              <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={addDeadline}>
                Add Deadline
              </Button>
            </div>

            {task.dueDate ? (
              <div className="flex items-center justify-between rounded-md border bg-muted/20 px-2 py-1">
                <span className="text-xs">{task.dueDate}</span>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={removeDeadline}>
                  Delete
                </Button>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground">No deadline set.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Reminders</Label>
            <form onSubmit={addReminder} className="space-y-2">
              <Input
                type="datetime-local"
                value={reminderAtInput}
                onChange={(e) => setReminderAtInput(e.target.value)}
                className="h-8 text-xs"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  value={reminderMessageInput}
                  onChange={(e) => setReminderMessageInput(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Reminder message"
                />
                <Button type="submit" variant="outline" size="sm" className="h-8 text-xs">
                  Add Reminder
                </Button>
              </div>
            </form>

            {sortedReminders.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">No reminders yet.</p>
            ) : (
              <div className="space-y-1.5">
                {sortedReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start justify-between gap-2 rounded-md border bg-muted/20 px-2 py-1.5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{formatReminderDate(reminder.at)}</p>
                      {reminder.message ? (
                        <p className="text-xs text-muted-foreground break-words">{reminder.message}</p>
                      ) : null}
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => removeReminder(reminder.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] uppercase">Personal Notes (not included in email)</Label>
            <div className="rounded-md border bg-background">
              <div className="flex items-center gap-1 border-b p-2">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyPersonalNoteFormat("bold")}>
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyPersonalNoteFormat("italic")}>
                  <Italic className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyPersonalNoteFormat("underline")}>
                  <Underline className="h-3.5 w-3.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => applyPersonalNoteFormat("insertUnorderedList")}>
                  <List className="h-3.5 w-3.5" />
                </Button>
                <span className="ml-1 text-[10px] text-muted-foreground">Text notes only</span>
              </div>

              <div
                ref={personalNoteEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => {
                  const nextValue = (e.currentTarget as HTMLDivElement).innerHTML;
                  personalNoteDraftRef.current = nextValue;
                  queuePersonalNoteSave(nextValue);
                }}
                onBlur={savePersonalNote}
                data-placeholder="Private notes, reminders, links..."
                className="min-h-[180px] p-3 text-sm outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/70 [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Projects</Label>

            <Select value={selectedProjectToAdd} onValueChange={handleProjectSelectInTask}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Assign existing project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PROJECT_SELECT_NONE}>Select project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value={PROJECT_SELECT_ADD_NEW}>+ Add new project</SelectItem>
              </SelectContent>
            </Select>

            {isAddingProject && (
              <form onSubmit={handleCreateProject} className="rounded-md border p-2 space-y-2">
                <Input
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="/Users/..."
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={isPickingProjectFolder}
                    onClick={() => void pickProjectFolder()}
                  >
                    {isPickingProjectFolder ? "Picking..." : "Pick Folder"}
                  </Button>
                  <Button type="submit" size="sm" className="flex-1" disabled={!newRepoUrl.trim()}>
                    Add Project
                  </Button>
                </div>
              </form>
            )}

            <div className="rounded-md border p-2 min-h-10">
              {taskProjects.length === 0 ? (
                <p className="text-xs text-muted-foreground">No projects assigned to this task.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {taskProjects.map((project) => (
                    <Badge
                      key={project.id}
                      variant="outline"
                      className="group/badge font-mono text-[10px] px-2 py-1 h-auto bg-background/60 border-border/50 text-muted-foreground gap-1"
                    >
                      <button type="button" onClick={() => openProjectInEditor(project.repoUrl)} className="hover:text-primary">
                        {project.name}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleTaskProject(project.id);
                        }}
                        className="opacity-70 hover:opacity-100 hover:text-destructive transition-opacity"
                        title="Remove from this task"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => void generateProjectComment()}
                disabled={isGeneratingProjectComment}
              >
                {isGeneratingProjectComment ? "Generating..." : "Generate Comment"}
              </Button>

              {generatedProjectComment && (
                <div className="space-y-2">
                  <Textarea readOnly value={generatedProjectComment} className="min-h-[130px] text-xs font-mono" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => void navigator.clipboard.writeText(generatedProjectComment)}
                  >
                    Copy Comment
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Tags</Label>
            <form onSubmit={addTag} className="flex gap-2">
              <Input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="urgent" />
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
                    <button type="button" className="hover:text-destructive" onClick={() => removeTag(tag)}>
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
