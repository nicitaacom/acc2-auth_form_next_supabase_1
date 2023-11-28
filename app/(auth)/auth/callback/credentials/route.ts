import { pusherServer } from "@/libs/pusher"
import supabaseAdmin from "@/libs/supabaseAdmin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getURL } from "@/utils/getURL"

export async function GET(request: Request) {
  // Get code to exchange this code to cookies session in the future
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // Redirect to error page if supabase throw error on recover
  const error_description = requestUrl.searchParams.get("error_description")
  if (error_description) {
    return NextResponse.redirect(`${getURL()}error?error_description=${error_description}`) //throw error like this
  }

  /* Exchange code for cookies - update row that user confirmed email */
  if (code) {
    // Exchange code to get cookies session
    const supabase = createRouteHandlerClient({ cookies })
    const response = await supabase.auth.exchangeCodeForSession(code)

    // Update row that user verified email
    if (response.data.user && response.data.user.email) {
      // Get username to set it in localstorage
      const { data: username_response } = await supabaseAdmin
        .from("users")
        .select("username")
        .eq("id", response?.data.user.id)
        .single()

      const user_id = response?.data.user.id
      const username = response.data.user.user_metadata.name || username_response?.username
      const email = response.data.user.email
      // TODO add here and another callback avatar url from auth.users user_metadata when 'change avatar' logic will be done
      const avatarUrl =
        response.data.user.user_metadata.avatar_url ||
        response.data.user?.identities![0]?.identity_data?.avatar_url ||
        response.data.user?.identities![1]?.identity_data?.avatar_url ||
        ""
      await supabaseAdmin
        .from("users")
        .update({ email_confirmed_at: response.data.user.updated_at, providers: ["credentials"] })
        .eq("id", response.data.user.id)

      // Trigger pusher to 'auth:completed' to show in another tab message like 'Authencication completed - thank you'
      await pusherServer.trigger(email, "auth:completed", null)

      return NextResponse.redirect(
        `${requestUrl.origin}/auth/completed?code=${code}
        &provider=credentials
        &userId=${user_id}
        &username=${username}
        &email=${email}
        &avatarUrl=${avatarUrl}`
      )
    }
  } else {
    const error_description = encodeURIComponent("No user found after exchanging cookies for registration")
    return NextResponse.redirect(`${getURL()}error?error_description=${error_description}`)
  }
}
