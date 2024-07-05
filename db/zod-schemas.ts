import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTable } from "./schemas/user";

export const userSchema = createInsertSchema(userTable, {
  email: (schema) => schema.email.email(),
});
