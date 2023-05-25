import { pgTable, uuid, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import type { InferModel } from 'drizzle-orm'

import { users } from "./users";

export const verificationTokens = pgTable('verificationTokens', {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull()
}, (table) => ({
  // emailIdx: index('email_id').on(table.email)
}))


export type VerificationTokens = InferModel<typeof verificationTokens>
export type NewVerificationToken = InferModel<typeof verificationTokens, 'insert'>