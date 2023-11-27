import Image from "next/image"
import { BackToMainButton } from "./components/BackToMainButton"
import useDarkMode from "@/store/ui/darkModeStore"
import { useEffect, useState } from "react"

export function AuthNotCompleted() {
  const { isDarkMode } = useDarkMode()
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  /* this state required for case when user turn screen to horizontal view */
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth > 1024)
    }

    // Set initial screen size
    handleResize()

    // Add resize event listener
    window.addEventListener("resize", handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center">
      {/* Conditionally show the image for small screens */}
      {isSmallScreen ? (
        <Image
          className="w-full h-[35vh]"
          src={isDarkMode ? "/errors/invalid-flow-state-found-dark.jpg" : "/errors/invalid-flow-state-found-light.jpg"}
          alt="invalid-flow-state-found"
          width={1920}
          height={386}
        />
      ) : (
        <div
          className={`w-full h-[35vh] relative ${
            isDarkMode ? "bg-[#0a6624]" : "bg-[#20e959]"
          } flex justify-center items-center`}>
          <Image
            className="w-[200px] mobile:w-[225px] tablet:w-[250px] laptop:w-[300px]"
            src={
              isDarkMode
                ? "/errors/invalid-flow-state-found-icon-dark.png"
                : "/errors/invalid-flow-state-found-icon-light.png"
            }
            alt="invalid-flow-state-found"
            width={1920}
            height={386}
          />
        </div>
      )}
      {/* Use className="text-danger" for styling instead of inline style */}
      <p className="text-danger">You auth flow not completed</p>
      {/* Add line breaks directly in the JSX */}
      <p className="text-center px-4">
        You got this error because you entered the URL in the search bar that needs to show a success message if the
        authentication is completed.
      </p>
      <p>Now close this page</p>
      <BackToMainButton />
    </div>
  )
}
