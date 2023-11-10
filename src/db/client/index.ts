import { drizzle } from "drizzle-orm/neon-http";

import { neon, neonConfig } from "@neondatabase/serverless";

neonConfig.fetchConnectionCache = true;

import * as schema from "../schema";

// NEON DATABASE CONNECTION
const neonSql = neon(process.env.NEON_DATABASE_URL!);
const neonDb = drizzle(neonSql, { schema: schema });

export default neonDb;
