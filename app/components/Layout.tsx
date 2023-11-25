'use client'

import { useEffect } from "react"

import useDarkMode from "../store/ui/darkModeStore"
	

export function Layout ({ children }: { children: React.ReactNode }) {

  const darkMode = useDarkMode()


    //children is a server component
  //more info - https://www.youtube.com/watch?v=9YuHTGAAyu0
  useEffect(() => {
    const htmlElement = document.documentElement
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Set initial mode based on system preference
    htmlElement.classList.toggle("light", !prefersDarkMode)
    htmlElement.classList.toggle("dark", prefersDarkMode)

    // Update mode when darkMode state changes
    htmlElement.classList.toggle("light", !darkMode.isDarkMode)
    htmlElement.classList.toggle("dark", darkMode.isDarkMode)
  }, [darkMode.isDarkMode])
return (
  <div
      className="flex flex-col w-full overflow-hidden min-h-screen
      bg-background text-title
      transition-colors duration-300">
      {children}
    </div>   
)
}