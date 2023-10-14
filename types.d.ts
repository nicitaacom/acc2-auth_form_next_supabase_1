declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PRODUCTION_URL: string

      NEXT_AUTH_URL: string
      NEXT_AUTH_SECRET: string

      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_SECRET: string

      NEXT_PUBLIC_FACEIT_CLIENT_ID: string
      NEXT_PUBLIC_FACEIT_CLIENT_SECRET: string
    }
  }
}

export {}
