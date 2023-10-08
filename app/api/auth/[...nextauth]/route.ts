import NextAuth, { NextAuthOptions } from 'next-auth'

import FaceitProvider from 'next-auth/providers/faceit'

export const authOptions: NextAuthOptions = {
  providers: [
    FaceitProvider({
      clientId: process.env.NEXT_PUBLIC_FACEIT_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEIT_CLIENT_SECRET,
    }),
  ],
}

export default NextAuth(authOptions);