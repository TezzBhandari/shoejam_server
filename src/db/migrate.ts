import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// const queryClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db");
// const db: PostgresJsDatabase = drizzle(queryClient);

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL as string, {
  max: 1,
});

const start = async () => {
  try {
    console.debug("migration started");
    await migrate(drizzle(migrationClient), { migrationsFolder: "src/db" });
    console.debug("migration complete");
    process.exit(0);
  } catch (error) {
    console.debug("migration failed");
    console.error(error);
    process.exit(-1);
  }
};

start();
