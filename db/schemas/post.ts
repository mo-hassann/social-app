import { pgTable, uuid, text, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const postTable = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const tagTable = pgTable("tag", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
});

export const postToTagTable = pgTable(
  "post_to_tag",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tagTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  })
);
