"use client"

import { AuthModal } from "@/(auth)/AuthModal"
import { useEffect, useState } from "react"

//This provider uses only for modals based on useState
export function ModalsProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <AuthModal />
    </>
  )
}
