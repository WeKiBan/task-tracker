import { useEffect, useRef } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastAction } from "@/components/ui/toast";
import { AuthSync } from "@/components/AuthSync";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Home from "@/pages/Home";
import TaskDetails from "@/pages/TaskDetails";
import NotFound from "@/pages/not-found";

function ReminderWatcher() {
  const tasks = useStore((state) => state.tasks);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const firedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const checkReminders = () => {
      const nowMs = Date.now();

      tasks.forEach((task) => {
        if (task.archived || !task.reminders || task.reminders.length === 0) {
          return;
        }

        task.reminders.forEach((reminder) => {
          const dueMs = new Date(reminder.at).getTime();
          if (!Number.isFinite(dueMs) || dueMs > nowMs) {
            return;
          }

          const signature = `${task.id}:${reminder.id}:${reminder.at}:${reminder.message}`;
          if (firedRef.current[signature]) {
            return;
          }

          firedRef.current[signature] = true;

          toast({
            title: `Reminder • ${task.jiraId}`,
            description: `${task.title}${reminder.message ? ` — ${reminder.message}` : ""}`,
            duration: 365 * 24 * 60 * 60 * 1000,
            action: (
              <ToastAction altText="Open task" onClick={() => setLocation(`/task/${task.id}`)}>
                Open task
              </ToastAction>
            ),
          });
        });
      });
    };

    checkReminders();
    const interval = window.setInterval(checkReminders, 15000);
    return () => window.clearInterval(interval);
  }, [tasks, toast, setLocation]);

  return null;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/task/:id" component={TaskDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthSync />
        <WouterRouter base={basePath}>
          <ReminderWatcher />
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
