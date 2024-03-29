import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL as string,
  },
} satisfies Config;
