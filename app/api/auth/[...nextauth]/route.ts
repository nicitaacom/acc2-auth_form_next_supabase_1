import NextAuth from 'next-auth'

import FaceitProvider from 'next-auth/providers/faceit'

export const authOptions = {
  providers: [
    FaceitProvider({
      clientId: process.env.NEXT_PUBLIC_FACEIT_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEIT_CLIENT_SECRET,
    }),
  ],
}

export const handler = NextAuth(authOptions)

export {handler as GET,handler as POST}