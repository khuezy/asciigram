import { and, eq, sql } from 'drizzle-orm'

import type { Adapter } from "next-auth/adapters"
import { users } from './models/users'
import { accounts } from './models/accounts'
import { verificationTokens } from './models/verificationTokens'

import {db} from './index'
export function DrizzleAdapterMySQL(): Adapter {
  return {
    createUser: async (data: any) => {

      const r = await db
        .insert(users)
        .values({ ...data })
        .returning()

      return db
        .select()
        .from(users)
        .where(eq(users.id, r[0].id))
        .then((res: any) => res[0])

    },
    getUser: async (data) => {
      const u = await db
        .select()
        .from(users)
        .where(eq(users.id, data))
        return u[0]
    },
    getUserByEmail: async (data) => {
      const r = await db
        .select()
        .from(users)
        .where(eq(users.email, data))
      return r[0]
    },
    createSession: async (data) => {
      return {} as any
    },
    getSessionAndUser: async (data) => {
      return {} as any
    },
    updateUser: async (data: any) => {
      if (!data.id) {
        throw new Error("No user id.")
      }
      const r = await db
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()

      return r[0]
    },
    updateSession: async (data) => {
      return {} as any
    },
    linkAccount: async (rawAccount) => {
      const {expires_in, ...rest} = rawAccount
      try {
        const r = await db
        .insert(accounts)
        .values({...rest, expires_at: (Date.now()/1000 + (expires_in as number)) >> 0})
      }
      catch(err) {
        console.log(err)
      }
    },
    getUserByAccount: async (account) => {
      const results = await db.select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .leftJoin(users, sql`${accounts.userId}::uuid = ${users.id}`)
      return results[0]?.users
    },
    deleteSession: async (sessionToken) => {
      return {} as any
    },
    createVerificationToken: async (token) => {
      await db
        .insert(verificationTokens)
        .values(token)

      return db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.identifier, token.identifier))
        .then((res: any) => res[0])
    },
    useVerificationToken: async (token) => {
      try {
        const deletedToken = await db
          .select()
          .from(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .then((res: any) => res[0])
          ?? null

        await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )

        return deletedToken
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: async (id) => {
      await db
        .delete(users)
        .where(eq(users.id, id))
        .then((res: any) => res[0])
    },
    unlinkAccount: async (account) => {
      await db.delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          )
        )

      return undefined
    }
  }
}