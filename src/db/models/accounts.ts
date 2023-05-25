import { pgTable, uuid, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'
// import { relations } from 'drizzle-orm'

import { users } from "./users";

export const accounts = pgTable('accounts', {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<any>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
}, (table) => ({
  // emailIdx: index('email_id').on(table.email)
}))


export type Accounts = InferModel<typeof accounts>
export type NewAccount = InferModel<typeof accounts, 'insert'>