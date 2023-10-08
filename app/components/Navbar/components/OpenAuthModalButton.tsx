"use client"

import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/Button"

export default function OpenAuthModalButton() {
  const pathname = usePathname()
  const updatedPath = pathname + (pathname.includes("?") ? "&" : "?") + "modal=" + "AuthModal"

  return (
    <Button className="w-fit" href={`${updatedPath}&variant=login`}>
      Open auth modal
    </Button>
  )
}
