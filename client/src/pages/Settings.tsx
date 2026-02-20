import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

import { SettingsForm } from "@/components/SettingsForm";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { isAuthReady, userId, isCloudLoaded } = useStore();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-muted-foreground">
        Restoring your session...
      </div>
    );
  }

  if (!userId) {
    return <AuthGate />;
  }

  if (!isCloudLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-muted-foreground">
        Loading your workspace...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl mx-auto p-4 space-y-4">
        <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to tasks
        </Button>

        <section className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
          <div className="mb-4">
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure your Jira integration and email templates.
            </p>
          </div>

          <SettingsForm onSave={() => setLocation("/")} />
        </section>
      </div>
    </main>
  );
}
