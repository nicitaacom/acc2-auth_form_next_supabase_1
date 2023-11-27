"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import useUserStore from "@/store/user/userStore"
import { Timer } from "@/(auth)/components"

export default function AuthCompleted() {
  const router = useRouter()
  const params = useSearchParams()?.get("code")?.trimEnd()
  const provider = useSearchParams()?.get("provider")?.trimEnd()
  console.log(13, "provider - ", provider)

  const userStore = useUserStore()

  //I use ?.trimEnd() to delete spaces in end of line that cause enter in auth/callback/route.ts (NextResponse.redirect)
  const userId = useSearchParams()?.get("userId")?.trimEnd()
  const username = useSearchParams()?.get("username")?.trimEnd()
  const email = useSearchParams()?.get("email")?.trimEnd()
  const avatarUrl = useSearchParams()?.get("avatarUrl")?.trimEnd()

  useEffect(() => {
    userStore.setUser(userId ?? "", username ?? "", email ?? "", avatarUrl ?? "")
    //to prevent error about too many re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (provider === "google" || provider === "twitter") {
    router.replace("/")
    return null
  }

  if (!params) {
    const error_description = encodeURIComponent("auth not completed")
    return router.push(`/error?error=${error_description}`)
  }

  function closePage() {
    window.close()
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-success">Auth completed - delete email</h1>
      <Timer label="I close this page in" seconds={3} action={closePage} />
    </div>
  )
}
