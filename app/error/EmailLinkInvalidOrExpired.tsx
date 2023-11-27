import Image from "next/image"

import useDarkMode from "@/store/ui/darkModeStore"
import { BackToMainButton } from "./components/BackToMainButton"

export function EmailLinkInvalidOrExpired() {
  const { isDarkMode } = useDarkMode()

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center">
      <div
        className={`w-full h-[35vh] relative ${
          isDarkMode ? "bg-[#0a6624]" : "bg-[#20e959]"
        } flex justify-center items-center`}>
        <Image
          className="w-[100px] laptop:w-[125px] desktop:w-[150px]"
          src={
            isDarkMode
              ? "/errors/email-link-invalid-or-has-expired-icon-dark.png"
              : "/errors/email-link-invalid-or-has-expired-icon-light.png"
          }
          alt="invalid-flow-state-found"
          width={1920}
          height={386}
        />
      </div>
      <p className="text-danger">Email link is invalid or has expired</p>
      <p className="text-center">Try again and use link that you become ASAP</p>
      <p className="text-center">Also don&apos;t use link that you already used</p>
      <BackToMainButton />
    </div>
  )
}
