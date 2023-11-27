import supabaseAdmin from "@/libs/supabaseAdmin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // get data about code to exchange this code to cookies session
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // get data about provider to save it in DB to throw error like
  // 'You already have signed in account with google - continue with google?'
  const provider = requestUrl.searchParams.get("provider")

  // 1. If supabase put something in error_description - show it on error page
  const error_description = requestUrl.searchParams.get("error_description")
  if (error_description) {
    const supabase_error_description = encodeURIComponent(error_description)
    return NextResponse.redirect(`${requestUrl.origin}/error?error_description=${supabase_error_description}`)
  }

  if (code) {
    // 2. Exchange cookies for session (to get session data)
    const supabase = createRouteHandlerClient({ cookies })
    const response = await supabase.auth.exchangeCodeForSession(code)

    if (response.data.user && response.data.user.email) {
      const user_id = response?.data.user.id
      const username = response.data.user.user_metadata.name
      const email = response.data.user.email
      const email_confirmed_at = response.data.user.email_confirmed_at
      const avatarUrl =
        response.data.user.user_metadata.avatar_url ||
        response.data.user?.identities![0]?.identity_data?.avatar_url ||
        response.data.user?.identities![1]?.identity_data?.avatar_url ||
        ""

      // 3. Insert row if user doesn't exist
      const { error: is_row_exist } = await supabaseAdmin.from("users").insert({
        id: user_id,
        username: username,
        email: email,
        email_confirmed_at: email_confirmed_at,
        avatar_url: avatarUrl,
        providers: [provider!],
      })
      // If row already exist - do 4 and 5
      if (is_row_exist) {
        // 4. If provider_response !=== provider - add one more provider
        // For case when user signIn with google first and then with the same email with twitter
        const { data: provider_response } = await supabaseAdmin
          .from("users")
          .select("providers")
          .eq("id", user_id)
          .single()
        // Check is provider exist (for case if user login 2 times with the same provider)
        const existingProvider = provider_response?.providers?.filter(providerLabel => providerLabel === provider)
        if (!existingProvider![0]) {
          const { error: update_provider_error } = await supabaseAdmin
            .from("users")
            .update({ providers: [...provider_response?.providers!, provider!] })
            .eq("id", response.data.user.id)
          if (update_provider_error) throw update_provider_error
        }

        // 5. Replace avatar_url if !avatar_url
        // For case if user have no avatar and signIn with oauth where user have avatar_url
        // TOTO - signIn with credentials - logout - login with oauth where !avatar_url
        const { data: avatar_url_reponse, error: select_avatar_url_error } = await supabaseAdmin
          .from("users")
          .select("avatar_url")
          .eq("email", email)
          .single()

        if (select_avatar_url_error) throw select_avatar_url_error
        if (!avatar_url_reponse?.avatar_url) {
          await supabaseAdmin
            .from("users")
            .update({
              email_confirmed_at: response.data.user.updated_at,
              avatar_url: avatarUrl,
            })
            .eq("id", user_id)
        }
      } else {
        // If row doesn't exist - this user login with OAuth first time so he haven't rows in other tables
        await supabaseAdmin.from("users_cart").insert({ id: user_id })
      }

      return NextResponse.redirect(
        `${requestUrl.origin}/auth/completed?code=${code}
        &provider=${provider}
        &userId=${user_id}
        &username=${username}
        &email=${email}
        &avatarUrl=${avatarUrl}`
      )
    } else {
      const error_description = encodeURIComponent("No user found after exchanging cookies for registration")
      return NextResponse.redirect(`${requestUrl.origin}/error?error_description=${error_description}`)
    }
  } else {
    // TODO - create image on error page for this case
    const error_description = encodeURIComponent("No code found to exchange cookies for session")
    return NextResponse.redirect(`${requestUrl.origin}/error?error_description=${error_description}`)
  }
}
