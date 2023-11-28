import supabaseAdmin from "@/libs/supabaseAdmin"
import { NextResponse } from "next/server"

export type TAPIAuthLogin = {
  email: string
}

export async function POST(req: Request) {
  const body: TAPIAuthLogin = await req.json()
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
      throw new Error("User exists - check your email\n You might not verified your email")
    }

    // 3. Return info about providers to show error like 'You already have account with google - continue with google?'
    const { data: provider_response } = await supabaseAdmin
      .from("users")
      .select("providers")
      .eq("email", body.email)
      .single()
    const providers = provider_response?.providers

    // 4. Return username to set it in localstorage with zustand
    const { data: username_response } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("email", body.email)
      .single()
    const username = username_response?.username

    return NextResponse.json({ providers: providers, username: username })
  } catch (error: any) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }
}
