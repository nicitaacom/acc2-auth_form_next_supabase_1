import Image from "next/image"

import useDarkMode from "@/store/ui/darkModeStore"
import { BackToMainButton } from "./components/BackToMainButton"

export function ExchangeCookiesError({ message }: { message?: string }) {
  const { isDarkMode } = useDarkMode()

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center">
      <div
        className={`w-full h-[35vh] relative ${
          isDarkMode ? "bg-[#0a6624]" : "bg-[#20e959]"
        } flex justify-center items-center`}>
        <Image
          className="w-[200px] laptop:w-[250px] desktop:w-[300px]"
          src={
            isDarkMode
              ? "/errors/user-not-found-after-exchanging-cookies-icon-dark.png"
              : "/errors/user-not-found-after-exchanging-cookies-icon-light.png"
          }
          alt="invalid-flow-state-found"
          width={300}
          height={226}
        />
      </div>
      <p className="text-danger text-center">{message ? message : "No user found when exchanging cookies"}</p>
      <p className="text-center">You might verified your email on new device or in incognito mode</p>
      <p className="text-center">To get support contact us here - {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</p>
      <BackToMainButton />
    </div>
  )
}
