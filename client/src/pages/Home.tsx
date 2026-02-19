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
import { ProjectManager } from "@/components/ProjectManager";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const { tasks, reorderTasks } = useStore();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        // Trigger report generation logic if needed directly or via ref
        // For simplicity, we rely on the button for now
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
    setActiveId(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold font-mono text-lg">DS</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Dev Status</h1>
          </div>

          <div className="flex items-center gap-3">
            <EmailGenerator />
            <ProjectManager />
            <ThemeToggle />
            <div className="w-px h-6 bg-border mx-1" />
            <CreateTaskDialog />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-5xl mx-auto p-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks (ID, Title, Notes)..." 
              className="pl-9 bg-muted/30 focus:bg-background transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="active">Active Tasks</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 min-h-[50vh]">
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTasks.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
                      <p>No active tasks found.</p>
                      <p className="text-sm opacity-60">Create a new task to get started.</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeTask ? (
                  <div className="opacity-90 scale-105 cursor-grabbing">
                    <TaskCard task={activeTask} isOverlay />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>

          <TabsContent value="archived">
            <ScrollArea className="h-[calc(100vh-250px)] rounded-md border p-4 bg-muted/10">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-80">
                {filteredTasks.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <p>No archived tasks found.</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
