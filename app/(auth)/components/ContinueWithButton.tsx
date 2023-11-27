import { Button } from "@/components/ui/Button"
import Image from "next/image"
import supabaseClient from "@/libs/supabaseClient"
import React from "react"

interface ContinueWithButtonProps {
  provider: "google" | "faceit" | "twitter"
  className?: string
  href?: string
}

export function ContinueWithButton({ href, provider, className }: ContinueWithButtonProps) {
  async function continueWith(e: React.FormEvent) {
    e.preventDefault()
    if (provider === "google") {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback/oauth?provider=google`,
        },
      })
      if (error) throw error
    } else if (provider === "faceit") {
      // TODO - add faceit provider
    } else if (provider === "twitter") {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "twitter",
        options: { redirectTo: `${location.origin}/auth/callback/oauth?provider=twitter` },
      })
      if (error) throw error
    }
  }

  return (
    <form onSubmit={continueWith}>
      <Button className={`min-h-[48px] ${className}`} href={href} target="_blank" variant="continue-with">
        {provider === "google" ? (
          <Image src="/google.png" alt="Continue with Google" width={24} height={24} priority />
        ) : provider === "faceit" ? (
          <Image src="/faceit.png" alt="Continue with Faceit" width={24} height={24} priority />
        ) : (
          <Image
            className="w-[24px] h-[19px]"
            src="/twitter.png"
            alt="Continue with Twitter"
            width={24}
            height={19}
            priority
          />
        )}
      </Button>
    </form>
  )
}
