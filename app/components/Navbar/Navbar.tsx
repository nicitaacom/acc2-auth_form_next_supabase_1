import { SwitchDarkMode } from "../SwitchDarkMode"
import { UserAvatar } from "./components/UserAvatar"

export function Navbar() {
  return (
    <nav className="flex justify-between gap-x-2 px-4 py-2">
      {/* LOGO */}
      <h1 className="text-title font-bold text-2xl">LOGO</h1>

      {/* Buttons */}
      <div className="flex flex-row gap-x-2 justify-center items-center">
        <SwitchDarkMode />
        <UserAvatar />
      </div>
    </nav>
  )
}
