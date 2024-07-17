import { relations } from "drizzle-orm";
import { commentTable } from "./comment";
import { postTable, postToTagTable, tagTable } from "./post";
import { commentLikeTable, postLikeTable } from "./like";
import { followingTable, userTable } from "./user";
import { activityTable } from "./activity";

export const userRelations = relations(userTable, ({ one, many }) => ({
  posts: many(postTable),
  comments: many(commentTable),
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

export const commentRelations = relations(commentTable, ({ one, many }) => ({
  user: one(userTable, { fields: [commentTable.userId], references: [userTable.id] }),
  post: one(postTable, { fields: [commentTable.postId], references: [postTable.id] }),
  likes: many(commentLikeTable),
  activities: many(activityTable), // add comment or edit the same comment
}));

export const followingRelations = relations(followingTable, ({ one, many }) => ({
  user: one(userTable, { fields: [followingTable.userId], references: [userTable.id] }),
  activities: one(activityTable), // only add follow and the un follow action will remove the activity
}));

export const activityRelations = relations(activityTable, ({ one, many }) => ({
  user: one(userTable, { fields: [activityTable.userId, activityTable.ownedUserId], references: [userTable.id, userTable.id] }),
  posts: one(postTable, { fields: [activityTable.postId], references: [postTable.id] }),
  comment: one(commentTable, { fields: [activityTable.commentId], references: [commentTable.id] }),
  postLike: one(postLikeTable, { fields: [activityTable.postLikeId], references: [postLikeTable.id] }),
  commentLike: one(commentLikeTable, { fields: [activityTable.commentLikeId], references: [commentLikeTable.id] }),
  following: one(followingTable, { fields: [activityTable.followingId], references: [followingTable.id] }),
}));
