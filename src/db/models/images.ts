import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
import { relations} from 'drizzle-orm'

import {posts} from './posts'

export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull(),
  data: text('data').notNull(),
}, (table) => ({
  postIdx: index('post_idx').on(table.postId)
}))

export const imagesRelations = relations(images, ({one}) => ({
  post: one(posts, {
    fields: [images.postId],
    references: [posts.id]
  })
}))



export type Images = InferModel<typeof images>
export type NewImage = InferModel<typeof images, 'insert'>