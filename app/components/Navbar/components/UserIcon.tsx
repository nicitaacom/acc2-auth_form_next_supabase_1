"use client"

import { useAuthModal } from "@/store/ui/authModal"
import { BiUserCircle } from "react-icons/bi"

export function UserIcon() {
  const authModal = useAuthModal()

  return <BiUserCircle className="text-icon-color cursor-pointer" onClick={authModal.openModal} size={28} />
}
