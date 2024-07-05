import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schemas",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://postgres:postgres@localhost:3001/social`,
  },
  verbose: true,
  strict: true,
});
