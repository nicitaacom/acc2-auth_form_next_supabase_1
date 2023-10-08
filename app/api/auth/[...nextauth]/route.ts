import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import FaceitProvider from 'next-auth/providers/faceit'

const options: NextAuthOptions = {
  providers: [
    FaceitProvider({
      clientId: process.env.NEXT_PUBLIC_FACEIT_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEIT_CLIENT_SECRET,
    }),
  ],
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)