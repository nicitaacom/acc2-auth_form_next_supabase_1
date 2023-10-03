## Problem

I may forgot how to configure cookie auth for my project

## Solution

Do it here with explanations

## Implementation

The problem in this implementation that I expose my anaon key
eyJhbGciOiJIU in dev tools - sources - \_next/static/chunks/app/page.js

pnpm i @supabase/supabase-js @supabase/auth-helpers-nextjs

ctrl+c ctrl+v utils and buttons in (auth)/login/components
protected routers works like in unauthenticated/page.tsx
to get info about user you need fetch data from server (you may don't worry about response times because its server components and server just return
a result of server component (html css js bundle - by bundle I mean .min html css js))

if you need some response from server like in LoginButton (for example) you use client component and router.refresh()
