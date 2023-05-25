import { pgTable, serial, timestamp, text, varchar, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'

import {users} from './users'
import {comments} from './comments'
import {images} from './images'
import {likes} from './likes'

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  author: varchar('author').notNull(),
  authorId: varchar('author_id').notNull(),
  avatar:  varchar('posts').notNull(),
  time: timestamp('time').defaultNow(),
  text: text('text')
}, (table) => ({
  authorIdx: index('author_idx').on(table.author)
}))

export const postsRelations = relations(posts, ({one, many}) => ({
  users: one(users, {
    fields: [posts.author],
    references: [users.id]
  }),
  comments: many(comments),
  images: many(images),
  likes: many(likes)
}))

export type Posts = InferModel<typeof posts>
export type NewPost= InferModel<typeof posts, 'insert'>