import { type Project, type Task } from "@shared/schema";

// This interface is just a placeholder since the frontend manages all data 
// via localStorage. We implement a basic memory storage to satisfy
// the architecture, but it won't be used by the client.

export interface IStorage {
  // No methods needed for local-only app
  healthCheck(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  constructor() {}

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const storage = new MemStorage();
