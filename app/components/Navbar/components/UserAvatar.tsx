"use client"
import Image from "next/image"

export function UserAvatar() {
  return <Image className="rounded-full" src="/placeholder.jpg" alt="user-avatar" width={32} height={32} />
}
