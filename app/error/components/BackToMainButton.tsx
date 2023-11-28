"use client"

import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export function BackToMainButton() {
  const router = useRouter()
  return (
    <Button variant="default-outline" onClick={() => router.push("/")}>
      Back to main
    </Button>
  )
}
