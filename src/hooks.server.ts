import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { GOOGLE_ID, GOOGLE_SECRET, AUTH_SECRET } from "$env/static/private";
import {DrizzleAdapterMySQL} from './db/adapter'
export const handle = SvelteKitAuth({
  secret: AUTH_SECRET,
  adapter: DrizzleAdapterMySQL(),
  session: {
    strategy: 'jwt',
  },
  providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],
  callbacks: {
    session: async ({ session, token }) => {
      // Adds the user id and role to the session object
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub as string
      }


      return session
    },
  }
});