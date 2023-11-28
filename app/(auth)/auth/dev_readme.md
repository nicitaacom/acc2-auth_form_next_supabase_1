## Usage for callback folder

I use callback folder **only** for callbacks (its where 3rd party site) for example:

1. User click 'verify my email' button (its callback because user click it on gmail.com or another email site)
2. User click 'continue with google' button (its callback because when user choose account he click 'user account' button on 3rd party site)
   ![user account button](https://i.imgur.com/LBbyITy.png)
3. User click 'recover my password' button - as well as 1 (user click this button on gmail.com - that's why its callback)

### Usage for callback/credentials/route.ts

This route required for case when user click 'verify email' button on email (e.g gmail.com)
In this route I:

1. Throw error if supabase throw error with #
2. If `code` I exchange this code to get cookies session (to use session data to update row)
3. Update row when user confirmed email
4. Trigger pusher event that show message like 'Authentication completed - thank you'

### Usage for callback/oauth/route.ts

1. Throw error if supabase throw error (usualy supabase add # that's why I use query param)
2. If `code` I exchange this code to get cookies session (to use session data for 3 4 5)
3. Insert row if user doesn't exist (if user exist I don't throw error - I just skip this step)
   because it shouldn't work like - I login with google - I logout - I login again with google and got error 'usex already exists'
4. Add one more provider if user login with new provider and with the same email for that provider
   For example:I login with google email1 - I logout - I login with twitter email1 - I add one more provider
   to show more relevant error like 'You already have account with this email - login with `google` or `twitter`'
5. Replace avatar url if user have no avatar
   For case when user login with credentials - logout - login with google

This route required for case when user click 'continue with google' or 'continue with twitter' button

## Usage for completed folder

This is `/auth/callback/completed` route that user see when verified email without errors

## Usage for callback/recover/route.ts

I use this route if user decide to change password
In this route I:

1. Throw error if supabase throw error because link to recover password was used or expired
2. Exchange cookies to get session data (and set session in cookies)
3. If 'credentials' provider doesn't exist - add 'credentials' provider to `providers` column in DB
4. Save email in cookies to tiger pusher to action like 'your password changed - stay safe'

**Auth modal**

```ts
useEffect(() => {
  if (isRecoverCompleted) setVariant("recoverCompleted")

  function recoverCompletedHandler(user: User) {
    setIsRecoverCompleted(true)
    setIsAuthCompleted(false)
    setIsEmailSent(false)
    reset()
    setTimeout(() => {
      // this timeout required to set avatarUrl from localstorage
      // you need to trigger setUser() again to update avatarUrl
      userStore.setUser(
        user.id,
        user.user_metadata.username || user.user_metadata.name,
        user.email!,
        user.user_metadata.avatar_url ||
          user?.identities![0]?.identity_data?.avatar_url ||
          user?.identities![1]?.identity_data?.avatar_url ||
          ""
      )
      router.refresh()
    }, 250)
  }

  pusherClient.bind("recover:completed", recoverCompletedHandler)
  return () => {
    if (getValues("email")) {
      pusherClient.unsubscribe(getValues("email"))
    }
    pusherClient.unbind("recover:completed", recoverCompletedHandler)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [getValues, isRecoverCompleted, reset, router])
```

**api/auth/recover/route.ts**

```ts
await pusherServer.trigger(body.email, "recover:completed", "")
```

Make sure you have `await` without it pusher willn't work in production - https://github.com/vercel/next.js/discussions/48433
