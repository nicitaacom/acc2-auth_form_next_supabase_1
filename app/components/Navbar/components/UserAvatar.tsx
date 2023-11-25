"use client"
import { useAuthModal } from "@/store/ui/authModal"
import Image from "next/image"

export function UserAvatar() {
  const authModal = useAuthModal()

  return (
    <Image
      className="rounded-full cursor-pointer"
      src="/placeholder.jpg"
      alt="user-avatar"
      width={32}
      height={32}
      onClick={authModal.openModal}
    />
  )
}
