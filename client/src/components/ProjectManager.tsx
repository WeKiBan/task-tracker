import { useState } from "react";
import { FolderGit2, Plus, Trash2 } from "lucide-react";
import { useStore, isLocalProjectPath, normalizeProjectUrlKey } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function ProjectManager() {
  const { projects, addProject, deleteProject } = useStore();
  const [newRepoUrl, setNewRepoUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRepoUrl.trim()) {
      if (!isLocalProjectPath(newRepoUrl)) {
        window.alert("Please provide a local folder path (for example: /Users/you/project).");
        return;
      }

      const normalizedNewProject = normalizeProjectUrlKey(newRepoUrl);
      const existingProject = projects.find(
        (project) => normalizeProjectUrlKey(project.repoUrl) === normalizedNewProject,
      );

      if (existingProject) {
        window.alert("Project already exists.");
        return;
      }

      addProject({ repoUrl: newRepoUrl.trim() });
      setNewRepoUrl("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <FolderGit2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <h4 className="font-medium mb-3">Projects</h4>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <Input 
            placeholder="/Users/..." 
            value={newRepoUrl}
            onChange={(e) => setNewRepoUrl(e.target.value)}
            className="h-8 text-sm flex-1"
          />
          <Button type="submit" size="sm" className="h-8 w-8 p-0" disabled={!newRepoUrl.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <Separator className="my-2" />

        <div className="max-h-[200px] overflow-y-auto space-y-1">
          {projects.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-2">
              No projects added yet
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="group flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{project.name}</span>
                  {project.repoUrl && (
                    <span className="text-[10px] text-muted-foreground truncate">{project.repoUrl}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
