import { Copy, Mail } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function EmailGenerator() {
  const { tasks } = useStore();
  const { toast } = useToast();

  const generateReport = () => {
    // Filter only active tasks (not archived)
    const activeTasks = tasks.filter(t => !t.archived);
    
    if (activeTasks.length === 0) {
      toast({
        title: "No tasks to report",
        description: "Add some active tasks first.",
        variant: "destructive",
      });
      return;
    }

    const report = activeTasks.map(task => 
      `${task.jiraId} ${task.title} - [${task.status}]`
    ).join("\n");

    navigator.clipboard.writeText(report);
    
    toast({
      title: "Copied to clipboard",
      description: `Generated report for ${activeTasks.length} active tasks.`,
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={generateReport}
      className="gap-2 hidden md:flex"
    >
      <Mail className="h-4 w-4" />
      Copy Report
    </Button>
  );
}
