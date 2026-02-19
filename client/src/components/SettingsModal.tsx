import { useState } from "react";
import { Settings as SettingsIcon, Plus, ExternalLink } from "lucide-react";
import { useStore } from "@/hooks/use-store";
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
import { Separator } from "@/components/ui/separator";

export function SettingsModal({ trigger }: { trigger?: React.ReactNode }) {
  const { settings, updateSettings, theme, setTheme } = useStore();
  const [open, setOpen] = useState(false);
  
  const [jiraUrl, setJiraUrl] = useState(settings.jiraBaseUrl);
  const [startText, setStartText] = useState(settings.emailStartText);
  const [endText, setEndText] = useState(settings.emailEndText);

  const handleSave = () => {
    updateSettings({
      jiraBaseUrl: jiraUrl,
      emailStartText: startText,
      emailEndText: endText,
      setupCompleted: true,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Jira integration and email templates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="jiraUrl">Jira Base URL</Label>
            <Input
              id="jiraUrl"
              placeholder="https://your-org.atlassian.net"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-[10px] text-muted-foreground">Used to create clickable task links.</p>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="startText">Email Start Text</Label>
            <Textarea
              id="startText"
              placeholder="Daily Status Update:"
              value={startText}
              onChange={(e) => setStartText(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endText">Email End Text</Label>
            <Textarea
              id="endText"
              placeholder="Thanks,"
              value={endText}
              onChange={(e) => setEndText(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t)}
                  className="capitalize flex-1"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SetupModal() {
  const { settings } = useStore();
  if (settings.setupCompleted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-xl shadow-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Welcome to Dev Status</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Let's get you set up with some basic configuration. You can change these anytime in settings.
        </p>
        <SettingsModal 
          trigger={
            <Button className="w-full" size="lg">Get Started</Button>
          } 
        />
      </div>
    </div>
  );
}
