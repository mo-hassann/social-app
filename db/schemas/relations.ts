import { relations } from "drizzle-orm";
import { commentTable } from "./comment";
import { postTable, postToTagTable, tagTable } from "./post";
import { commentLikeTable, postLikeTable } from "./like";
import { followingTable, userTable } from "./user";
import { notificationTable } from "./notification";

export const userRelations = relations(userTable, ({ one, many }) => ({
  posts: many(postTable),
  comments: many(commentTable),
  postLikes: many(postLikeTable),
  commentLikes: many(commentLikeTable),
  following: many(followingTable),
  notifications: many(notificationTable),
}));

export const postRelations = relations(postTable, ({ one, many }) => ({
  user: one(userTable, { fields: [postTable.userId], references: [userTable.id] }),
  comments: many(commentTable),
  postLikes: many(postLikeTable),
  notifications: many(notificationTable),
  postToTag: many(postToTagTable),
}));

export const tagRelations = relations(tagTable, ({ one, many }) => ({
  postToTag: many(postToTagTable),
}));

export const postToTagRelations = relations(postToTagTable, ({ one, many }) => ({
  post: one(postTable, { fields: [postToTagTable.postId], references: [postTable.id] }),
  tag: one(tagTable, { fields: [postToTagTable.tagId], references: [tagTable.id] }),
}));

export const postLikeRelations = relations(postLikeTable, ({ one, many }) => ({
  user: one(userTable, { fields: [postLikeTable.userId], references: [userTable.id] }),
  post: one(postTable, { fields: [postLikeTable.postId], references: [postTable.id] }),
  notifications: one(notificationTable),
}));

export const commentLikeRelations = relations(commentLikeTable, ({ one, many }) => ({
  user: one(userTable, { fields: [commentLikeTable.userId], references: [userTable.id] }),
  comment: one(commentTable, { fields: [commentLikeTable.commentId], references: [commentTable.id] }),
  notifications: one(notificationTable),
}));

export const commentRelations = relations(commentTable, ({ one, many }) => ({
  user: one(userTable, { fields: [commentTable.userId], references: [userTable.id] }),
  post: one(postTable, { fields: [commentTable.postId], references: [postTable.id] }),
  likes: many(commentLikeTable),
  notifications: many(notificationTable),
}));

export const followingRelations = relations(followingTable, ({ one, many }) => ({
  user: one(userTable, { fields: [followingTable.userId], references: [userTable.id] }),
}));

export const notificationRelations = relations(notificationTable, ({ one, many }) => ({
  user: one(userTable, { fields: [notificationTable.userId, notificationTable.toUserId], references: [userTable.id, userTable.id] }),
  posts: one(postTable, { fields: [notificationTable.postId], references: [postTable.id] }),
  comment: one(commentTable, { fields: [notificationTable.commentId], references: [commentTable.id] }),
  postLike: one(postLikeTable, { fields: [notificationTable.postLikeId], references: [postLikeTable.id] }),
  commentLike: one(commentLikeTable, { fields: [notificationTable.commentLikeId], references: [commentLikeTable.id] }),
}));
