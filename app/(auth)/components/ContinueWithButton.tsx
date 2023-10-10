import { Button } from "@/components/ui/Button"
import Image from "next/image"
import supabaseClient from "@/utils/supabaseClient"
import React from "react"

export default function ContinueWithButton({ provider }: { provider: "google" | "faceit" | "twitter" }) {
  async function continueWith(e: React.FormEvent) {
    e.preventDefault()
    if (provider === "google") {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback/` },
      })
      if (error) throw error
    } else if (provider === "faceit") {
      //do stuff
    } else if (provider === "twitter") {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "twitter",
        options: { redirectTo: `${location.origin}/auth/callback/` },
      })
      if (error) throw error
    }
  }

  return (
    <form onSubmit={continueWith}>
      <Button className="min-h-[48px]" variant="continue-with">
        {provider === "google" ? (
          <Image src="/google.png" alt="Continue with Google" width={24} height={24} priority />
        ) : provider === "faceit" ? (
          <Image src="/faceit.png" alt="Continue with Faceit" width={24} height={24} priority />
        ) : (
          <Image src="/twitter.png" alt="Continue with Twitter" width={24} height={24} priority />
        )}
      </Button>
    </form>
  )
}
