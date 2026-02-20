import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Search, Puzzle } from "lucide-react";
import { signOut } from "firebase/auth";

import { useStore, type Task, type TaskStatus } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { SettingsModal, SetupModal } from "@/components/SettingsModal";
import { EmailGenerator } from "@/components/EmailGenerator";
import { AuthGate } from "@/components/AuthGate";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { auth } from "@/lib/firebase";

type QuickFilter = "none" | "dueToday" | "overdue" | "hasReminder";
type CombinedFilter = "all" | QuickFilter | `status:${TaskStatus}`;

const STATUSES: TaskStatus[] = [
  "Not Started",
  "In Progress",
  "Waiting for Info",
  "In Dev",
  "In Prod",
  "Closed",
  "Suspended",
];

const todayIsoDate = () => new Date().toISOString().slice(0, 10);
const CHROME_WEB_STORE_URL = "";

export default function Home() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    restoreTasks,
    reorderTasks,
    settings,
    userId,
    isCloudLoaded,
    isAuthReady,
    resetForSignOut,
  } = useStore();
  const { toast } = useToast();

  const isMacOS =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  const commandShortcutLabel = isMacOS ? "⌘K" : "Ctrl+K";
  const bulkShortcutLabel = isMacOS ? "⇧⌘A" : "Ctrl+Shift+A";
  const emailShortcutLabel = isMacOS ? "⌘E" : "Ctrl+E";

  const isImportFlow = new URLSearchParams(window.location.search).get("import") === "1";

  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [combinedFilter, setCombinedFilter] = useState<CombinedFilter>("all");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isProcessingImport, setIsProcessingImport] = useState(isImportFlow);
  const hasHandledImportRef = useRef(false);

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectionUiRef = useRef<HTMLDivElement>(null);
  const taskAreaRef = useRef<HTMLDivElement>(null);

  const selectedTasks = tasks.filter((task) => selectedTaskIds.includes(task.id));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape" && selectionMode && !isCommandOpen) {
        event.preventDefault();
        setSelectionMode(false);
        setSelectedTaskIds([]);
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen(true);
      }

      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setSelectionMode((current) => {
          const next = !current;
          if (!next) {
            setSelectedTaskIds([]);
          }
          return next;
        });
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        const activeTasks = tasks.filter((task) => !task.archived);
        if (activeTasks.length > 0) {
          const taskLines = activeTasks
            .map((task) => {
              const summary = task.note?.trim();
              return summary
                ? `${task.jiraId} ${task.title} - ${summary}`
                : `${task.jiraId} ${task.title}`;
            })
            .join("\n");
          const report = `${settings.emailStartText}\n\n${taskLines}\n\n${settings.emailEndText}`;
          navigator.clipboard.writeText(report);
          toast({ title: "Email summary copied" });
        } else {
          toast({ title: "No active tasks to export" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tasks, settings, toast, selectionMode, isCommandOpen]);

  useEffect(() => {
    if (!selectionMode) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (isCommandOpen) {
        return;
      }

      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      const isInSelectionUi = selectionUiRef.current?.contains(target);
      const isInTaskArea = taskAreaRef.current?.contains(target);
      if (isInSelectionUi || isInTaskArea) {
        return;
      }

      setSelectionMode(false);
      setSelectedTaskIds([]);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [selectionMode, isCommandOpen, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldImport = params.get("import") === "1";

    if (!shouldImport) {
      setIsProcessingImport(false);
      return;
    }

    if (hasHandledImportRef.current) {
      setIsProcessingImport(false);
      return;
    }

    if (!userId || !isCloudLoaded) {
      return;
    }

    hasHandledImportRef.current = true;

    const jiraId = (params.get("jiraId") || "").trim();
    const title = (params.get("title") || "").trim();

    if (!jiraId || !title) {
      window.history.replaceState({}, "", window.location.pathname);
      setIsProcessingImport(false);
      return;
    }

    const isDuplicate = useStore.getState().tasks.some(
      (task) =>
        task.jiraId.toLowerCase() === jiraId.toLowerCase() &&
        task.title.toLowerCase() === title.toLowerCase(),
    );

    if (!isDuplicate) {
      addTask({
        jiraId,
        title,
        status: "Not Started",
        note: "",
        tags: ["imported"],
        projectIds: [],
      });
    }

    window.history.replaceState({}, "", window.location.pathname);
    setIsProcessingImport(false);
  }, [userId, isCloudLoaded, addTask]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.jiraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const dueDate = task.dueDate || "";
    const today = todayIsoDate();

    let matchesCombinedFilter = true;
    if (combinedFilter === "dueToday") {
      matchesCombinedFilter = dueDate === today;
    } else if (combinedFilter === "overdue") {
      matchesCombinedFilter = !!dueDate && dueDate < today && !task.archived;
    } else if (combinedFilter === "hasReminder") {
      matchesCombinedFilter = (task.reminders || []).length > 0;
    } else if (combinedFilter.startsWith("status:")) {
      matchesCombinedFilter = task.status === combinedFilter.replace("status:", "");
    }

    if (activeTab === "active") {
      return !task.archived && matchesSearch && matchesCombinedFilter;
    }

    return task.archived && matchesSearch && matchesCombinedFilter;
  });

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null;

  const clearSelection = () => {
    setSelectedTaskIds([]);
  };

  const toggleTaskSelected = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const bulkArchiveSelected = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    const previous = selectedTasks.map((task) => ({ id: task.id, archived: task.archived }));
    selectedTasks.forEach((task) => updateTask(task.id, { archived: true }));
    clearSelection();

    toast({
      title: `${previous.length} task(s) archived`,
      action: (
        <ToastAction
          altText="Undo archive"
          onClick={() => {
            previous.forEach((item) => updateTask(item.id, { archived: item.archived }));
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  const bulkDeleteSelected = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    const deleted = selectedTasks.map((task) => ({ ...task }));
    selectedTasks.forEach((task) => deleteTask(task.id));
    clearSelection();

    toast({
      title: `${deleted.length} task(s) deleted`,
      description: "You can undo this action.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Undo delete"
          onClick={() => {
            restoreTasks(deleted);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTasks = tasks.filter((task) => !task.archived);
      const oldIndex = activeTasks.findIndex((task) => task.id === active.id);
      const newIndex = activeTasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);
        const archivedTasks = tasks.filter((task) => task.archived);
        reorderTasks([...reorderedActive, ...archivedTasks]);
      }
    }
    setActiveId(null);
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-muted-foreground">
        {isImportFlow ? "Importing ticket..." : "Restoring your session..."}
      </div>
    );
  }

  if (!userId) {
    return <AuthGate />;
  }

  if (!isCloudLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-muted-foreground">
        {isImportFlow ? "Importing ticket..." : "Loading your workspace..."}
      </div>
    );
  }

  if (isProcessingImport) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-muted-foreground">
        Importing ticket...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SetupModal />

      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-3xl mx-auto h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-black font-mono text-xs">TP</span>
            </div>
            <h1 className="font-bold text-sm tracking-tight hidden sm:block">Task Pilot</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-xs"
              onClick={() => setIsExtensionDialogOpen(true)}
            >
              <Puzzle className="h-3.5 w-3.5 mr-1" />
              Add Extension
            </Button>
            <EmailGenerator />
            <SettingsModal />
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-xs"
              onClick={async () => {
                if (auth) {
                  try {
                    await signOut(auth);
                    resetForSignOut();
                  } catch (error) {
                    console.error("Failed to sign out:", error);
                  }
                }
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto p-4 flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-2">
          <div className="sticky top-12 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-2 border-b">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-2 mb-2 pt-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search tasks (title, Jira, notes, tags...)"
                  className="pl-8 h-8 text-xs bg-muted/20 border-transparent focus:bg-background transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={combinedFilter} onValueChange={(value) => setCombinedFilter(value as CombinedFilter)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tasks</SelectItem>
                  <SelectItem value="dueToday">Due today</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="hasReminder">Has reminder</SelectItem>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={`status:${status}`}>
                      Status: {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div ref={selectionUiRef}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <TabsList className="h-8 p-0.5 bg-muted/30 border-none w-full max-w-[200px]">
                  <TabsTrigger value="active" className="h-7 text-[10px] uppercase font-bold tracking-wider">Active</TabsTrigger>
                  <TabsTrigger value="archived" className="h-7 text-[10px] uppercase font-bold tracking-wider">Archived</TabsTrigger>
                </TabsList>

                <Button
                  type="button"
                  variant={selectionMode ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    setSelectionMode((current) => !current);
                    clearSelection();
                  }}
                >
                  Bulk select
                </Button>
              </div>

              {selectionMode && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{selectedTaskIds.length} selected</span>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={bulkArchiveSelected} disabled={selectedTaskIds.length === 0}>
                    Archive
                  </Button>
                  <Button type="button" variant="destructive" size="sm" className="h-7 text-xs" onClick={bulkDeleteSelected} disabled={selectedTaskIds.length === 0}>
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[10px] text-muted-foreground">
                Shortcuts: {commandShortcutLabel} command palette • {bulkShortcutLabel} bulk select • {emailShortcutLabel} copy email summary
              </p>
              <CreateTaskDialog
                iconOnly
                triggerClassName="h-8 w-8 aspect-square p-0 bg-black text-white hover:bg-black/90 rounded-md border border-black"
              />
            </div>
          </div>

          <div ref={taskAreaRef}>
            <TabsContent value="active" className="mt-0">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2 pt-1">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                        <p className="text-xs font-medium">No active tasks</p>
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          selectionMode={selectionMode}
                          isSelected={selectedTaskIds.includes(task.id)}
                          onToggleSelect={toggleTaskSelected}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
                <DragOverlay dropAnimation={null}>
                  {activeTask ? (
                    <div className="w-[calc(100vw-32px)] max-w-3xl">
                      <TaskCard task={activeTask} isOverlay />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </TabsContent>

            <TabsContent value="archived" className="mt-0">
              <div className="flex flex-col gap-2 opacity-80 pt-1">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                    <p className="text-xs font-medium">No archived tasks</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      selectionMode={selectionMode}
                      isSelected={selectedTaskIds.includes(task.id)}
                      onToggleSelect={toggleTaskSelected}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No command found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { setActiveTab("active"); setIsCommandOpen(false); }}>
              Show active tasks
            </CommandItem>
            <CommandItem onSelect={() => { setActiveTab("archived"); setIsCommandOpen(false); }}>
              Show archived tasks
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Filters">
            <CommandItem onSelect={() => { setCombinedFilter("overdue"); setIsCommandOpen(false); }}>
              Show overdue tasks
            </CommandItem>
            <CommandItem onSelect={() => { setCombinedFilter("dueToday"); setIsCommandOpen(false); }}>
              Show due today
            </CommandItem>
            <CommandItem onSelect={() => { setCombinedFilter("status:In Progress"); setIsCommandOpen(false); }}>
              Filter status: In Progress
            </CommandItem>
            <CommandItem onSelect={() => { setCombinedFilter("all"); setSearchQuery(""); setIsCommandOpen(false); }}>
              Clear all filters
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setSelectionMode((current) => !current); clearSelection(); setIsCommandOpen(false); }}>
              Toggle bulk select mode
            </CommandItem>
            <CommandItem onSelect={() => { searchInputRef.current?.focus(); setIsCommandOpen(false); }}>
              Focus main search
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={isExtensionDialogOpen} onOpenChange={setIsExtensionDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Add Browser Extension</DialogTitle>
            <DialogDescription>
              Use Chrome Web Store for one-click install, or load the local developer extension.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border p-3 space-y-2">
              <p className="text-xs font-semibold">Option 1 — Chrome Web Store (recommended)</p>
              <p className="text-xs text-muted-foreground">
                One-click install and auto-updates. Publish once, then installs are simple for everyone.
              </p>
              <Button
                type="button"
                className="h-8 text-xs"
                onClick={() => {
                  if (!CHROME_WEB_STORE_URL) {
                    toast({
                      title: "Web Store URL not configured",
                      description: "Set your extension listing URL in Home before using this option.",
                      variant: "destructive",
                    });
                    return;
                  }

                  window.open(CHROME_WEB_STORE_URL, "_blank", "noopener,noreferrer");
                  setIsExtensionDialogOpen(false);
                }}
              >
                Open Chrome Web Store
              </Button>
            </div>

            <div className="rounded-md border p-3 space-y-2">
              <p className="text-xs font-semibold">Option 2 — Local developer extension</p>
              <p className="text-xs text-muted-foreground">
                Opens your extension folder and Chrome extensions page for Load unpacked.
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/open-browser-extension-folder", { method: "POST" });
                    const payload = (await response.json().catch(() => ({}))) as { message?: string; path?: string };

                    if (!response.ok) {
                      toast({
                        title: "Could not open extension folder",
                        description: payload.message || "Please open the browser-extension folder manually.",
                        variant: "destructive",
                      });
                      return;
                    }

                    void navigator.clipboard.writeText(payload.path || "browser-extension");
                    window.open("chrome://extensions", "_blank", "noopener,noreferrer");

                    toast({
                      title: "Load unpacked in Chrome",
                      description: "Enable Developer mode, click Load unpacked, and select the opened browser-extension folder.",
                    });
                    setIsExtensionDialogOpen(false);
                  } catch {
                    toast({
                      title: "Could not start extension install",
                      description: "Open chrome://extensions and load the browser-extension folder manually.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Open Local Install Flow
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsExtensionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
