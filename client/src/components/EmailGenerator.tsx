import { Copy, Mail } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { buildStatusEmailReport } from "@/lib/email";

export function EmailGenerator() {
  const { tasks, settings } = useStore();
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

    const report = buildStatusEmailReport(activeTasks, settings);

    navigator.clipboard.writeText(report);
    
    toast({
      title: "Status email copied to clipboard",
      description: `Report includes ${activeTasks.length} active tasks.`,
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
