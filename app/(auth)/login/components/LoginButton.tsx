"use client"

import supabase from "@/utils/supabaseClient"

import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export default async function LoginButton() {
  const router = useRouter()

  async function login() {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: "example@gmail.com",
      password: "test123",
    })
    router.refresh()
  }

  return (
    <form action={login}>
      <Button variant="default-outline">Login</Button>
    </form>
  )
}
