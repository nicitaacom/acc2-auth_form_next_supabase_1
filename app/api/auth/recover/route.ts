import supabaseAdmin from "@/libs/supabaseAdmin"
import { NextResponse } from "next/server"

export type TAPIAuthRecover = {
  email: string
}

export async function POST(req: Request) {
  const body: TAPIAuthRecover = await req.json()
  const requestUrl = new URL(req.url)

  try {
    // 1. Check is user with this email doesn't exist
    const { data: email_response, error: emailSelectError } = await supabaseAdmin
      .from("users")
      .select("email,email_confirmed_at")
      .eq("email", body.email)
      .single()
    const email = email_response?.email

    if (!email) {
      throw new Error("User with this email doesn't exist")
    }
    if (emailSelectError) {
      console.log(22, "emailSelectError \n", emailSelectError)
      throw emailSelectError
    }

    // 2. Resend email if user try to login with email that already exists but not confirmed
    if (email_response?.email === email && !email_response.email_confirmed_at) {
      const { error: resendError } = await supabaseAdmin.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${requestUrl.origin}/auth/callback/credentials`,
        },
      })
      if (resendError) throw resendError
      throw new Error("I don't let you change password without verified email\n Check your email")
    }

    return NextResponse.json({ status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }
}
