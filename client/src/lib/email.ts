import type { Task } from "@/hooks/use-store";

const formatTaskLine = (task: Task) => {
  const summary = task.note?.replace(/\s+/g, " ").trim();
  if (!summary) {
    return `${task.jiraId} ${task.title}`;
  }

  return `${task.jiraId} ${task.title} [**${summary}**]`;
};

export const buildStatusEmailReport = (
  tasks: Task[],
  settings: { emailStartText: string; emailEndText: string },
) => {
  const taskLines = tasks.map(formatTaskLine).join("\n");
  return `${settings.emailStartText}\n\n${taskLines}\n\n${settings.emailEndText}`;
};
