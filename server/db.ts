// Minimal db setup - not used for persistence in this local-only app
// but keeping structure for compatibility if needed later.

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use a fallback or empty pool if no DB is provisioned, 
// since we are using localStorage for this app.
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/db" 
});

// We won't actually use this in the app
export const db = drizzle(pool, { schema });
