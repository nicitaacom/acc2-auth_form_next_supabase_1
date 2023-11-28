import supabaseAdmin from "@/libs/supabaseAdmin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getURL } from "@/utils/getURL"

export async function GET(request: Request) {
  // Get code to exchange this code to cookies session in the future
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // 1. Redirect to error page if supabase throw error on recover
  const error_description = requestUrl.searchParams.get("error_description")
  if (error_description) {
    return NextResponse.redirect(`${getURL()}error?error_description=${error_description}`) //throw error like this
  }
  if (code) {
    // 2. Exchange cookies to set session and get session data
    const supabase = createRouteHandlerClient({ cookies })
    const response = await supabase.auth.exchangeCodeForSession(code)
    if (response.data.user && response.data.user.email) {
      // 3. If provider_response !=== 'credentials' - add one more provider
      // For case when user signIn with google first and then recover password
      const { data: provider_response } = await supabaseAdmin
        .from("users")
        .select("providers")
        .eq("id", response.data.user.id)
        .single()
      // Check is provider exist (for case if user login 2 times with the same provider)
      const existingProvider = provider_response?.providers?.filter(providerLabel => providerLabel === "credentials")
      if (!existingProvider![0]) {
        const { error: update_provider_error } = await supabaseAdmin
          .from("users")
          .update({ providers: [...provider_response?.providers!, "credentials"] })
          .eq("id", response.data.user.id)
        if (update_provider_error) throw update_provider_error
      }

      return NextResponse.redirect(`${requestUrl.origin}?recover=resetPassword&code=${code}`)
    } else {
      const error_description = encodeURIComponent("No user found after exchanging cookies for recovering")
      return NextResponse.redirect(`${getURL()}error?error_description=${error_description}`)
    }
  } else {
    const error_description = encodeURIComponent("No code found to exchange cookies for session")
    return NextResponse.redirect(`${getURL()}error?error_description=${error_description}`)
  }
}
