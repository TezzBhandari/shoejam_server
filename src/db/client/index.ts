import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/postgres-js";

import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

import * as schema from "../schema";
import postgres from "postgres";

// POSTGRES DRIVER
const postgresSQL = postgres(process.env.DATABASE_URL as string);
const postgresDb = pgDrizzle(postgresSQL, { schema: schema });

// NEON DATABASE CONNECTION
const neonSQL = neon(process.env.NEON_DATABASE_URL!);

const start = new Date();
neonSQL`select NOW();`.then(([res]) => {
  const end = new Date();
  const dbNow = res && res.now ? (res.now as string) : "";
  console.log({ now: dbNow, latency: end.getTime() - start.getTime() });
});

const _neonDb = drizzle(neonSQL, { schema: schema });

export default postgresDb;
