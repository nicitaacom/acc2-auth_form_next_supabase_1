import supabaseServer from "@/utils/supabaseServer"
import { redirect } from "next/navigation"

export default async function Unauthenticated() {
  const { data: session } = await supabaseServer.auth.getSession()

  if (session) {
    redirect("/")
  }
  return <p>Please sign in</p>
}
