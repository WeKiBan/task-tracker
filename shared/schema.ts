import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE: This app uses localStorage, so these tables are primarily for type generation
// and structure validation, though we'll keep the standard define for consistency.

export const projects = pgTable("projects", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  repoUrl: text("repo_url").notNull(),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(), // UUID
  jiraId: text("jira_id").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("Not Started"), // Not Started, In Progress, Completed, Suspended
  note: text("note").default(""),
  projectIds: text("project_ids").array().default([]), // Array of project UUIDs
  archived: boolean("archived").default(false).notNull(),
  order: integer("order").notNull(),
});

// Zod Schemas
export const insertProjectSchema = createInsertSchema(projects);
export const insertTaskSchema = createInsertSchema(tasks);

// Types
export type Project = z.infer<typeof insertProjectSchema>;
export type Task = z.infer<typeof insertTaskSchema>;

export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "Suspended";
