
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useStore } from "@/hooks/use-store";

// Expose addProject for browser console bulk import
if (typeof window !== "undefined") {
	window.addProject = useStore.getState().addProject;
}

createRoot(document.getElementById("root")!).render(<App />);
