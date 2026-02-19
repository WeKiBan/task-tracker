import { useEffect, useState } from "react";
import { 
  DndContext, 
  DragOverlay,
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { Search } from "lucide-react";

import { useStore, type Task } from "@/hooks/use-store";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsModal, SetupModal } from "@/components/SettingsModal";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { tasks, reorderTasks, settings } = useStore();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + N for New Task
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        // Since the dialog is triggered by state in CreateTaskDialog, 
        // we'd need a global dialog state. For now, we follow standard UI.
      }
      
      // CMD/CTRL + E for Generate Email
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        const activeTasks = tasks.filter(t => !t.archived);
        if (activeTasks.length > 0) {
          const taskLines = activeTasks.map(task => `${task.jiraId} ${task.title} - [${task.status}]`).join("\n");
          const report = `${settings.emailStartText}\n\n${taskLines}\n\n${settings.emailEndText}`;
          navigator.clipboard.writeText(report);
          // Toast usually requires hook inside component, 
          // we could trigger the button click via ref if needed.
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tasks, settings]);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.jiraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.note.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "active") {
      return !task.archived && matchesSearch;
    } else {
      return task.archived && matchesSearch;
    }
  });

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeTasks = tasks.filter(t => !t.archived);
      const oldIndex = activeTasks.findIndex((t) => t.id === active.id);
      const newIndex = activeTasks.findIndex((t) => t.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedActive = arrayMove(activeTasks, oldIndex, newIndex);
        const archivedTasks = tasks.filter(t => t.archived);
        reorderTasks([...reorderedActive, ...archivedTasks]);
      }
    }
    setActiveId(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SetupModal />
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-3xl mx-auto h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-black font-mono text-xs">DS</span>
            </div>
            <h1 className="font-bold text-sm tracking-tight hidden sm:block">Dev Status</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <EmailGenerator />
            <SettingsModal />
            <div className="w-px h-4 bg-border mx-1" />
            <CreateTaskDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-3xl mx-auto p-4 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-8 h-8 text-xs bg-muted/20 border-transparent focus:bg-background transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          <TabsList className="h-8 p-0.5 bg-muted/30 border-none w-full max-w-[200px] mb-2">
            <TabsTrigger value="active" className="h-7 text-[10px] uppercase font-bold tracking-wider">Active</TabsTrigger>
            <TabsTrigger value="archived" className="h-7 text-[10px] uppercase font-bold tracking-wider">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0 flex-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={filteredTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                      <p className="text-xs font-medium">No active tasks</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
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

          <TabsContent value="archived" className="mt-0 flex-1">
            <div className="flex flex-col gap-2 opacity-80">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/5">
                  <p className="text-xs font-medium">No archived tasks</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
