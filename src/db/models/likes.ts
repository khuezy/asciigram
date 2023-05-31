import { pgTable, serial, uuid, integer, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
import { relations} from 'drizzle-orm'

import {posts} from './posts'
import {users} from './users'

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(),
  userId: uuid('user_id').notNull(),
  
}, (table) => ({
  postIdx: index('post_idx').on(table.postId),
  userIdx: index('user_idx').on(table.userId)
}))

export const likesRelations = relations(likes, ({one}) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id]
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id]
  })
}))



export type Likes = InferModel<typeof likes>
export type NewLike = InferModel<typeof likes, 'insert'>