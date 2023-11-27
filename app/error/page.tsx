"use client"

import { useSearchParams } from "next/navigation"

import { EmailLinkInvalidOrExpired } from "./EmailLinkInvalidOrExpired"
import { ExchangeCookiesError } from "./ExchangeCookiesError"
import { AuthNotCompleted } from "./AuthNotCompleted"
import { BackToMainButton } from "./components/BackToMainButton"

export default function Error() {
  const error_description = useSearchParams()?.get("error_description")

  if (error_description === "Email link is invalid or has expired") {
    return <EmailLinkInvalidOrExpired />
  }
  if (error_description === "No user found after exchanging cookies for registration") {
    return <ExchangeCookiesError message="No user found after exchanging cookies for registration" />
  }
  if (error_description === "No user found after exchanging cookies for recovering") {
    return <ExchangeCookiesError message="No user found after exchanging cookies for recovering" />
  }
  if (error_description === "You have no access to this route - your auth not completed") {
    return <AuthNotCompleted />
  }

  // Get error details from URL

  return (
    <div className="min-h-screen flex flex-col gap-y-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        {error_description ? (
          <p className="text-danger">{error_description}</p>
        ) : (
          <p className="text-danger">Unknown error occurred</p>
        )}
        <p>Please let us know how you got this error here - {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</p>
      </div>
      <BackToMainButton />
    </div>
  )
}
