import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'

import { posts } from "./posts";
import { comments } from "./comments";

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
}, (table) => ({
  emailIdx: index('email_id').on(table.email)
}))

export const usersRelations = relations(users, ({many}) => ({
  posts: many(posts),
  comments: many(comments)
}))



export type Users = InferModel<typeof users>
export type NewUser = InferModel<typeof users, 'insert'>