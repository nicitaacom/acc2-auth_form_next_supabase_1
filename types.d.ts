declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FACEIT_CLIENT_ID: string
      NEXT_PUBLIC_FACEIT_CLIENT_SECRET: string
      NEXT_PUBLIC_GITHUB_CLIENT_ID: string
      NEXT_PUBLIC_GITHUB_CLIENT_SECRET: string
    }
  }
}

export {}
