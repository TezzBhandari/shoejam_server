import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { neon, neonConfig } from "@neondatabase/serverless";
neonConfig.fetchConnectionCache = true;

import * as schema from "../schema";

// NEON DATABASE CONNECTION
const sql = neon(process.env.NEON_DATABASE_URL as string);
// const neonDb = drizzle(sql);

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL as string);
const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, {
  schema: schema,
});

export default db;

// NEON DATABASE
