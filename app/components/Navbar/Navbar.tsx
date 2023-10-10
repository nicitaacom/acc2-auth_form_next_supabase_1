import supabaseServer from "@/utils/supabaseServer"
import { OpenAuthModalButton, UserIcon } from "./components"

export default async function Navbar() {
  const user = await supabaseServer.auth.getUser()

  return (
    <nav className="px-8 py-4 flex justify-between items-center gap-x-4">
      <OpenAuthModalButton />
      <UserIcon user={user} />
    </nav>
  )
}