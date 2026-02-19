import { z } from 'zod';

// Minimal routes definition - frontend will use localStorage but this structure
// helps maintain consistency if we ever add a backend sync.

export const api = {};
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  return path;
}
