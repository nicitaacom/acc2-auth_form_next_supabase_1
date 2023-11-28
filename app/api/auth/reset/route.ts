import { pusherServer } from "@/libs/pusher"
import supabaseServer from "@/libs/supabaseServer"
import { NextResponse } from "next/server"

export type TAPIAuthReset = {
  email: string
  password: string
}

export async function POST(req: Request) {
  const body: TAPIAuthReset = await req.json()

  try {
    const { data, error } = await supabaseServer().auth.updateUser({ password: body.password })

    // 1. Change default supabase error.message to curstom error.message
    if (error) {
      if (error.message === "New password should be different from the old password.") {
        throw new Error("Its already your password - enter new one")
      }
      throw new Error(error.message)
    }

    // 2. Triger pusher for recover:completed event to show message like 'recover completed - thank you'
    await pusherServer.trigger(body.email, "recover:completed", data.user)

    return NextResponse.json({ user: data.user })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }
}
