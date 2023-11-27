"use client"

import Image from "next/image"

import useUserStore from "@/store/user/userStore"
import { Button } from "@/components/ui/Button"
import supabaseClient from "@/libs/supabaseClient"
import { useRouter } from "next/navigation"

export function UserAvatar() {
  const router = useRouter()
  const userStore = useUserStore()

  async function logout() {
    await supabaseClient.auth.signOut()
    userStore.logoutUser()
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <Image
        className="rounded-full cursor-pointer"
        src={userStore.avatarUrl ? userStore.avatarUrl : "/placeholder.jpg"}
        alt="user-avatar"
        width={32}
        height={32}
      />
      <p>{userStore.username}</p>
      <Button variant="link" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}
