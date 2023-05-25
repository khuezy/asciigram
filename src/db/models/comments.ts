import { pgTable, serial, text, uuid, index, integer } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
import { relations} from 'drizzle-orm'

import { posts } from "./posts";
import { users } from "./users";

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  comment: text('comment').notNull(),
  authorId: uuid('author_id').notNull(),
  postId: integer('post_id').notNull(),
}, (table) => ({
  postIdx: index('post_idx').on(table.postId),
  authorIdx: index('author_idx').on(table.authorId)
}))

export const commentsRelations = relations(comments, ({one}) => ({
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  user: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  })
}))



export type Comments = InferModel<typeof comments>
export type NewComment = InferModel<typeof comments, 'insert'>