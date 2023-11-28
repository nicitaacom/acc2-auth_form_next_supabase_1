# IMPORTANT

use location.origin - because if you use getURL() - you might be redirected to
strange vercel url like https://acc2-auth-form-next-supabase-2-81igjdwi3-nicitaacom.vercel.app/
and got error with red background for entire screen like 'its dangerous site

## If you got one of 2 erros

1. Invalid auth flow found
2. AuthApiError: invalid request: both auth code and code verifier should be non-empty

Try

```ts
return NextResponse.redirect(`${location.origin}/auth/completed?code=${code}`)
```

And try do it in `(auth)/auth/callback/smth/route.ts`
Just create `smth` folder and change it in `Continue with button`
