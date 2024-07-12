import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { followingTable, userTable } from "./user";
import { postTable } from "./post";
import { commentTable } from "./comment";
import { commentLikeTable, postLikeTable } from "./like";
import { createSelectSchema } from "drizzle-zod";

export const activityEnum = pgEnum("activity_enum", ["CREATE_POST", "EDIT_POST", "CREATE_COMMENT", "EDIT_COMMENT", "POST_LIKE", "COMMENT_LIKE", "FOLLOW_USER"]);

export const activityTable = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  activityName: activityEnum("activity_name"),

  postId: uuid("post_id").references(() => postTable.id),
  commentId: uuid("comment_id").references(() => commentTable.id),
  postLikeId: uuid("post_like_id").references(() => postLikeTable.id),
  commentLikeId: uuid("comment_like_id").references(() => commentLikeTable.id),
  followingId: uuid("following_id").references(() => followingTable.id),

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// db tables schemas
export const activitySchema = createSelectSchema(activityTable);
