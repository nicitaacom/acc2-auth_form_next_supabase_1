"use client"

import supabase from "@/utils/supabaseClient"

import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export default function RegisterButton() {
  const router = useRouter()

  async function register() {
    let { data, error } = await supabase.auth.signUp({
      email: "jon@supabase.com",
      password: "test123",
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.refresh()
  }

  return (
    <form action={register}>
      <Button variant="default-outline">Register</Button>
    </form>
  )
}
