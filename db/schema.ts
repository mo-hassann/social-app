import { relations } from "drizzle-orm";
import { pgTable, uuid, text, integer, varchar, date, timestamp, pgEnum, primaryKey, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/* 
Description: A platform where users can create profiles, post updates, follow other users, like and comment on posts.
Features: User authentication, profile management, real-time notifications, news feed, search functionality, messaging system.
xKkZ1Qs9GJgjQ1K3
*/

// todo add block functionality

export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  userName: varchar("user_name", { length: 256 }).unique(),
  name: varchar("name", { length: 256 }),
  bio: text("bio"),
  pictureLink: text("picture_link"),
  email: varchar("email", { length: 256 }).unique(),
  dateOfBirth: date("date_of_birth"),
});

export const followingTable = pgTable("following", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const postTable = pgTable("post", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const commentTable = pgTable("comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  postId: uuid("post_id")
    .notNull()
    .references(() => postTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subCommentTable = pgTable("sub_comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => commentTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikeTable = pgTable(
  "post_like",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUsePost: unique("unique_user_post").on(table.postId, table.userId),
  })
);

export const commentLikeTable = pgTable(
  "comment_like",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => commentTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueUserComment: unique("unique_user_comment").on(table.commentId, table.userId),
  })
);

export const activityEnum = pgEnum("activity_enum", ["CREATE_POST", "EDIT_POST", "CREATE_COMMENT", "EDIT_COMMENT", "CREATE_SUB_COMMENT", "EDIT_SUB_COMMENT", "POST_LIKE", "COMMENT_LIKE", "FOLLOW_USER"]);

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
  subCommentId: uuid("sub_comment_id").references(() => subCommentTable.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// relations
export const userRelations = relations(userTable, ({ one, many }) => ({
  posts: many(postTable),
  comments: many(commentTable),
  subComments: many(subCommentTable),
  postLikes: many(postLikeTable),
  commentLikes: many(commentLikeTable),
  following: many(followingTable),
  activities: many(activityTable),
}));

export const postRelations = relations(postTable, ({ one, many }) => ({
  user: one(userTable, { fields: [postTable.userId], references: [userTable.id] }),
  comments: many(commentTable),
  postLikes: many(postLikeTable),
  activities: many(activityTable), // add post or edit the same post
  postToTag: many(postToTagTable),
}));

export const tagRelations = relations(tagTable, ({ one, many }) => ({
  postToTag: many(postToTagTable),
}));

export const postToTagRelations = relations(postToTagTable, ({ one, many }) => ({
  post: one(postTable, { fields: [postToTagTable.postId], references: [postTable.id] }),
  tag: one(tagTable, { fields: [postToTagTable.tagId], references: [tagTable.id] }),
}));

export const commentRelations = relations(commentTable, ({ one, many }) => ({
  user: one(userTable, { fields: [commentTable.userId], references: [userTable.id] }),
  post: one(postTable, { fields: [commentTable.postId], references: [postTable.id] }),
  likes: many(commentLikeTable),
  subComments: many(subCommentTable),
  activities: many(activityTable), // add comment or edit the same comment
}));

export const subCommentRelations = relations(subCommentTable, ({ one, many }) => ({
  user: one(userTable, { fields: [subCommentTable.userId], references: [userTable.id] }),
  comment: one(commentTable, { fields: [subCommentTable.commentId], references: [commentTable.id] }),
  activities: many(activityTable), // add sub-comment or edit the same sub-comment
}));

export const postLikeRelations = relations(postLikeTable, ({ one, many }) => ({
  user: one(userTable, { fields: [postLikeTable.userId], references: [userTable.id] }),
  post: one(postTable, { fields: [postLikeTable.postId], references: [postTable.id] }),
  activities: one(activityTable), // only add like and the dislike action will remove the activity
}));

export const commentLikeRelations = relations(commentLikeTable, ({ one, many }) => ({
  user: one(userTable, { fields: [commentLikeTable.userId], references: [userTable.id] }),
  comment: one(commentTable, { fields: [commentLikeTable.commentId], references: [commentTable.id] }),
  activities: one(activityTable), // only add like and the dislike action will remove the activity
}));

export const followingRelations = relations(followingTable, ({ one, many }) => ({
  user: one(userTable, { fields: [followingTable.userId], references: [userTable.id] }),
  activities: one(activityTable), // only add follow and the un follow action will remove the activity
}));

export const activityRelations = relations(activityTable, ({ one, many }) => ({
  user: one(userTable, { fields: [activityTable.userId], references: [userTable.id] }),
  posts: one(postTable, { fields: [activityTable.postId], references: [postTable.id] }),
  comment: one(commentTable, { fields: [activityTable.commentId], references: [commentTable.id] }),
  subComment: one(subCommentTable, { fields: [activityTable.subCommentId], references: [subCommentTable.id] }),
  postLike: one(postLikeTable, { fields: [activityTable.postLikeId], references: [postLikeTable.id] }),
  commentLike: one(commentLikeTable, { fields: [activityTable.commentLikeId], references: [commentLikeTable.id] }),
  following: one(followingTable, { fields: [activityTable.followingId], references: [followingTable.id] }),
}));

// z types
export const userSchema = createInsertSchema(userTable, {
  email: (schema) => schema.email.email(),
  dateOfBirth: z.coerce.string(),
});
