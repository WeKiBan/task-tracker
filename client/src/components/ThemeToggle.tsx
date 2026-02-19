import { Moon, Sun } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 hover:bg-muted/50 transition-colors"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 text-primary transition-all duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-orange-500 transition-all duration-300" />
      )}
    </Button>
  );
}
