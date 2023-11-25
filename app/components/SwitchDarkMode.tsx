"use client"

import useDarkMode from "@/store/ui/darkModeStore"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function SwitchDarkMode({ className, ...props }: SwitchProps) {
  const mode = useDarkMode()

  return (
    <label
      className={`relative w-[36px] h-[20px] border-[3px] border-icon-color hover:brightness-75 transition-all duration-300 
    rounded-full cursor-pointer mx-1 flex ${className}`}>
      <input
        className="hidden peer/input"
        {...props}
        type="checkbox"
        id="check"
        checked={mode.isDarkMode}
        onChange={mode.toggleDarkMode}
      />
      <span
        className={`absolute rounded-full
      w-[10px] h-[10px] translate-x-[20%] translate-y-[20%] bg-icon-color transition-all duration-500
      before:absolute before:content-['']
      peer-checked/input:translate-x-[180%]`}
      />
    </label>
  )
}
