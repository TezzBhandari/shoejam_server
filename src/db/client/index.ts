import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL as string);
const db: PostgresJsDatabase = drizzle(queryClient);

export default db;
