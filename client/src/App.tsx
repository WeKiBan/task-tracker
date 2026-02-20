import { useEffect, useRef, useState } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastAction } from "@/components/ui/toast";
import { AnimatePresence, motion } from "framer-motion";
import { AuthSync } from "@/components/AuthSync";
import { useStore } from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Home from "@/pages/Home";
import TaskDetails from "@/pages/TaskDetails";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const pageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    y: 16,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    y: -8,
    filter: "blur(4px)",
  }),
};

const getPageDepth = (location: string) => {
  if (location === "/") {
    return 0;
  }

  if (location.startsWith("/task/") || location === "/settings") {
    return 1;
  }

  return 0;
};

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
  const [location] = useLocation();
  const [direction, setDirection] = useState(1);
  const previousLocationRef = useRef(location);
  const pendingPopNavigationRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      pendingPopNavigationRef.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const previousLocation = previousLocationRef.current;
    if (previousLocation === location) {
      return;
    }

    if (pendingPopNavigationRef.current) {
      setDirection(-1);
      pendingPopNavigationRef.current = false;
      previousLocationRef.current = location;
      return;
    }

    const previousDepth = getPageDepth(previousLocation);
    const nextDepth = getPageDepth(location);
    setDirection(nextDepth > previousDepth ? 1 : -1);
    previousLocationRef.current = location;
  }, [location]);

  return (
    <AnimatePresence initial={false} mode="wait" custom={direction}>
      <motion.div
        key={location}
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/task/:id" component={TaskDetails} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
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
