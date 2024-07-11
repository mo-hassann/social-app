import { pgTable, uuid, text, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  bio: text("bio"),
  image: text("image"),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
});

export const followingTable = pgTable("following", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// db tables schemas
export const userSchema = createSelectSchema(userTable, {
  email: (schema) => schema.email.email(),
});

export const followingSchema = createSelectSchema(followingTable);
