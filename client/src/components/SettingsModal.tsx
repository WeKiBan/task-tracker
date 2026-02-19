import { useState } from "react";
import { Settings as SettingsIcon, ExternalLink, Pencil, Save, Trash2, X } from "lucide-react";
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

interface SettingsModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showDefaultTrigger?: boolean;
}

export function SettingsModal({
  trigger,
  open,
  onOpenChange,
  showDefaultTrigger = true,
}: SettingsModalProps) {
  const { settings, projects, updateSettings, updateProject, deleteProject, theme, setTheme } = useStore();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;
  
  const [jiraUrl, setJiraUrl] = useState(settings.jiraBaseUrl);
  const [startText, setStartText] = useState(settings.emailStartText);
  const [endText, setEndText] = useState(settings.emailEndText);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingRepoUrl, setEditingRepoUrl] = useState("");

  const handleSave = () => {
    updateSettings({
      jiraBaseUrl: jiraUrl,
      emailStartText: startText,
      emailEndText: endText,
      setupCompleted: true,
    });
    setDialogOpen(false);
  };

  const shouldRenderTrigger = trigger !== undefined || showDefaultTrigger;

  const startEditProject = (projectId: string, repoUrl: string) => {
    setEditingProjectId(projectId);
    setEditingRepoUrl(repoUrl);
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditingRepoUrl("");
  };

  const saveEditProject = () => {
    if (!editingProjectId || !editingRepoUrl.trim()) {
      return;
    }

    updateProject(editingProjectId, { repoUrl: editingRepoUrl.trim() });
    cancelEditProject();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {shouldRenderTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          )}
        </DialogTrigger>
      )}
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

          <Separator />

          <div className="space-y-2">
            <Label>Projects</Label>
            <div className="max-h-44 overflow-y-auto space-y-2 rounded-md border p-2">
              {projects.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No projects yet.</p>
              ) : (
                projects.map((project) => {
                  const isEditing = editingProjectId === project.id;

                  return (
                    <div key={project.id} className="rounded border p-2 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium truncate">{project.name}</span>
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={saveEditProject}
                                disabled={!editingRepoUrl.trim()}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={cancelEditProject}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => startEditProject(project.id, project.repoUrl)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (isEditing) cancelEditProject();
                                  deleteProject(project.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <Input
                          value={editingRepoUrl}
                          onChange={(e) => setEditingRepoUrl(e.target.value)}
                          className="h-8 text-xs"
                          placeholder="Repo URL"
                        />
                      ) : (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
                        >
                          {project.repoUrl}
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      )}
                    </div>
                  );
                })
              )}
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
  const { settings, userId, isCloudLoaded } = useStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isImportFlow = new URLSearchParams(window.location.search).get("import") === "1";

  if (!userId || !isCloudLoaded) return null;
  if (isImportFlow) return null;

  if (settings.setupCompleted) return null;

  return (
    <>
      {!settingsOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border rounded-xl shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-2">Welcome to Dev Status</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Let's get you set up with some basic configuration. You can change these anytime in settings.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setSettingsOpen(true)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        showDefaultTrigger={false}
      />
    </>
  );
}
