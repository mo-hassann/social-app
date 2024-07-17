import { pgTable, uuid, text, varchar, date, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
  followingCount: integer("following_count").notNull().default(0),
  followersCount: integer("followers_count").notNull().default(0),
});

export const followingTable = pgTable("following", {
  id: uuid("id").defaultRandom().primaryKey(),
  followedBy: uuid("followed_by")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

// db tables schemas
export const userInsertSchema = createSelectSchema(userTable, {
  email: (schema) => schema.email.email(),
  dateOfBirth: z.coerce.date().nullable(),
  userName: z.string().regex(/^[a-z0-9_]{8,16}$/, { message: "Username must be from 8 to 16 characters long and contain only lowercase letters, numbers, and underscores." }),
});

export const userSelectSchema = createInsertSchema(userTable, {
  email: (schema) => schema.email.email(),
  // dateOfBirth: z.coerce.date()
});

export const updateUserProfileSchema = userInsertSchema.pick({ bio: true, dateOfBirth: true, name: true, userName: true });
