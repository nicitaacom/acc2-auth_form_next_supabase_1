"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from "next/navigation"

import { useForm } from "react-hook-form"
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai"
import supabaseClient from "@/utils/supabaseClient"

import { FormInput } from "../Inputs/Validation/FormInput"
import ContinueWithButton from "@/(auth)/components/ContinueWithButton"
import { Button, Checkbox, ModalContainer } from ".."
import { Timer } from "@/(auth)/components"

//TODO - its trash code - reduce line amount of line

interface AdminModalProps {
  label: string
}

interface FormData {
  username: string
  email: string
  emailOrUsername: string
  password: string
}

export function AuthModal({ label }: AdminModalProps) {
  const router = useRouter()

  const pathname = usePathname()
  const queryParams = useSearchParams().get("variant")
  const [isChecked, setIsChecked] = useState(false)
  const [responseMessage, setResponseMessage] = useState<React.ReactNode>(<p></p>)
  //for case when user click 'Forgot password?' or 'Create account' and some data in responseMessage
  useEffect(() => {
    setResponseMessage(<p></p>)
  }, [queryParams])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  //when user submit form and got response message from server
  function displayResponseMessage(message: React.ReactNode) {
    setResponseMessage(message)
  }

  async function signInWithPassword(emailOrUsername: string, password: string) {
    //Check user wants login with email or username
    const isEmail = emailOrUsername.includes("@")
    if (isEmail) {
      try {
        const { data: user, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: emailOrUsername,
          password: password,
        })
        if (signInError) throw signInError

        if (user.user) {
          //store info somewhere (e.g in localStorage with zustand)
          displayResponseMessage(<p className="text-success">You are logged in</p>)
          reset()
          router.refresh()
        } 
      } catch (error: unknown) {
        if (error instanceof Error) {
          displayResponseMessage(<p className="text-danger">{error.message}</p>)
          console.error("Login with email - ", error)
        } else {
          displayResponseMessage(
            <p className="text-danger">
              An unknown error occurred - contact admin
              <Button href="https://t.me/nicitaacom" variant="link">
                here
              </Button>
            </p>,
          )
          console.error("Unknown error - ", error)
        }
      }
    } else {
      try {
        const { data: email, error: emailSelectError } = await supabaseClient
          .from("users")
          .select("email")
          .eq("username", emailOrUsername)
        if (emailSelectError) throw emailSelectError
        if (email && email.length > 0) {
          const { data: user, error: signInError } = await supabaseClient.auth.signInWithPassword({
            email: email[0].email,
            password: password,
          })
          if (signInError) throw signInError

          if (user.user) {
            //store info somewhere (e.g in localStorage with zustand)
            displayResponseMessage(<p className="text-success">You are logged in</p>)
            reset()
            router.refresh()
          }
        } else {
          displayResponseMessage(<p className="text-danger">No user with this username</p>)
        }
      } catch (error) {
        if (error instanceof Error) {
          displayResponseMessage(<p className="text-danger">{error.message}</p>)
          console.error("Login with email - ", error)
        } else {
          displayResponseMessage(
            <p className="text-danger">
              An unknown error occurred - contact admin
              <Button href="https://t.me/nicitaacom" variant="link">
                here
              </Button>
            </p>,
          )
          console.error("Unknown error - ", error)
        }
      }
    }
  }

  async function signUp(username: string, email: string, password: string) {
    try {
      const { data: user, error: signUpError } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      if (signUpError) throw signUpError
      if (user.user) {
        //any necessary actions in database (e.g insert row in users table and in users_cart table)
        /* Boilerplate 
        const { error: errorUsersInsert } = await supabase
          .from("users")
          .insert({ id: response.data.user.id, username: username, email: email })
        if (errorUsersInsert) throw errorUsersInsert
        const { error: errorUsersCartInsert } = await supabase.from("users_cart").insert({ id: response.data.user.id })
        if (errorUsersCartInsert) throw errorUsersCartInsert
        */
        //ohter actions like save into in LocalStorage with zustand
        // (to don't do request to db every time we need user info or not use regular localstorage)
        //displayResponse message
        setResponseMessage(<p className="text-success">Check your email</p>)
        setTimeout(() => {
          setResponseMessage(
            <div className="flex flex-row">
              Don't revice email?&nbsp;
              <Timer label="resend in" seconds={60}>
                <Button type="button" variant="link" onClick={() => resendVerificationEmail(email)}>
                  resend
                </Button>
              </Timer>
            </div>,
          )
        }, 5000)
      }
    } catch (error) {
      if (error instanceof Error) {
        displayResponseMessage(<p className="text-danger">{error.message}</p>)
        console.error("Login with email - ", error)
      } else {
        displayResponseMessage(
          <p className="text-danger">
            An unknown error occurred - contact admin
            <Button href="https://t.me/nicitaacom" variant="link">
              here
            </Button>
          </p>,
        )
        console.error("Unknown error - ", error)
      }
    }
  }

  async function resendVerificationEmail(email: string) {
    try {
       const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email: email,
    })
    if (error) throw error
    displayResponseMessage(<p className="text-success">Message resended</p>)
    } catch (error) {
       if (error instanceof Error) {
        displayResponseMessage(<p className="text-danger">{error.message}</p>)
        console.error("Login with email - ", error)
      } else {
        displayResponseMessage(
          <p className="text-danger">
            An unknown error occurred - contact admin
            <Button href="https://t.me/nicitaacom" variant="link">
              here
            </Button>
          </p>,
        )
        console.error("Unknown error - ", error)
      }
    }
   
  }

  async function recoverPassword(email:string) {
    try {
      
    const {error} = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/?modal=AuthModal&variant=reset-password`})
    if (error) throw error
    displayResponseMessage(<p className="text-success">Check your email</p>)

    } catch (error) {
       if (error instanceof Error) {
        displayResponseMessage(<p className="text-danger">{error.message}</p>)
        console.error("Login with email - ", error)
      } else {
        displayResponseMessage(
          <p className="text-danger">
            An unknown error occurred - contact admin
            <Button href="https://t.me/nicitaacom" variant="link">
              here
            </Button>
          </p>,
        )
        console.error("Unknown error - ", error)
      }
    }
  }

  async function resetPassword(password:string) {
    try {
    //TODO - check if this password already belong to current email
    const {error} = await supabaseClient.auth.updateUser({ password: password })
      if (error) throw error
      displayResponseMessage(<p className="text-success">Your password changed</p>)
      router.push('/')
    } catch (error) {
  if (error instanceof Error && error.message  === 'New password should be different from the old password.') {
    displayResponseMessage(<p className="text-danger">Its already your password - enter new one</p>)
    console.error("Login with email - ", error);
  } else if (error instanceof Error) {
    displayResponseMessage(<p className="text-danger">{error.message}</p>);
    console.error("Login with email - ", error);
  } else {
    displayResponseMessage(
      <p className="text-danger">
        An unknown error occurred - contact admin
        <Button href="https://t.me/nicitaacom" variant="link">
          here
        </Button>
      </p>
    );
    console.error("Unknown error - ", error);
  }
}
  }
  

  const onSubmit = async (data: FormData) => {
    console.log(data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (queryParams === "login") {
      signInWithPassword(data.emailOrUsername, data.password)
    } else if (queryParams === "register") {
      signUp(data.username, data.email, data.password)
      reset()
    } else if (queryParams === "recover") {
      recoverPassword(data.email)
      reset()
    } else {
      resetPassword(data.password)
    }
  }

  return (
    <ModalContainer
      className={`w-[500px] 
    ${queryParams === "login" ? "h-[550px]" : queryParams === "register" ? "h-[625px]" : "h-[325px]"}
${
  //for login height when errors
  queryParams === "login" && (errors.emailOrUsername || errors.password) && "!h-[610px]"
}
${
  //for register height when errors
  queryParams === "register" && (errors.email || errors.password) && "!h-[700px]"
} 
${
  //for reset-password height when errors
  queryParams === "reset-password" && errors.password && "!h-[350px]"
}
transition-all duration-500`}
      modalQuery="AuthModal">
      <div className="flex flex-col justify-center gap-y-2 w-[90%] mx-auto">
        <div className="flex flex-row gap-x-4 items-center h-[100px]">
          <Image className="w-[30px] h-[40px]" src="/big-dark.png" alt="logo" width={80} height={100} />
          <h1 className="text-4xl font-bold">
            {queryParams === "login" ? "Login" : queryParams === "register" ? "Register" : "Recover"}
          </h1>
        </div>

  {queryParams === 'login' || 'register' || 'recover' ? 
<>
        <form className="relative max-w-[450px] w-[75vw] flex flex-col gap-y-2 mb-4" onSubmit={handleSubmit(onSubmit)}>
          {queryParams === "register" && (
            <FormInput
              endIcon={<AiOutlineUser size={24} />}
              register={register}
              errors={errors}
              id="username"
              label="Username"
              placeholder="HANTARESpeek"
              disabled={isSubmitting}
              required
            />
          )}
          {queryParams !== "login" && queryParams !== 'reset-password' && (
            <FormInput
              endIcon={<AiOutlineMail size={24} />}
              register={register}
              errors={errors}
              id="email"
              label="Email"
              placeholder="user@big.com"
              disabled={isSubmitting}
              required
            />
          )}
          {queryParams === "login" && (
            <FormInput
              endIcon={<AiOutlineUser size={24} />}
              register={register}
              errors={errors}
              id="emailOrUsername"
              label="Email or username"
              placeholder="HANTARESpeek"
              disabled={isSubmitting}
              required
            />
          )}
          {queryParams !== "recover" && (
            <FormInput
              endIcon={<AiOutlineLock size={24} />}
              register={register}
              errors={errors}
              id="password"
              label="Password"
              type="password"
              placeholder={queryParams === 'reset-password' ? "NeW-RaNd0m_PasWorD" : "RaNd0m_PasWorD"}
              disabled={isSubmitting}
              required
            />
          )}
          {/* LOGIN-BODY-HELP */}
          <div className="flex justify-between mb-2">
            <div className={`${(queryParams === "recover" || queryParams === 'reset-password') && "invisible"}`}>
              {/* 'Remember me' now checkbox do nothing - expected !isChecked 1m jwt - isChecked 3m jwt */}
              <Checkbox
                className="bg-background cursor-pointer"
                label="Remember me"
                onChange={() => setIsChecked(isChecked => !isChecked)}
                disabled={isSubmitting}
                isChecked={isChecked}
              />
            </div>
          {queryParams !== 'register' &&
            <Button
              href={`${pathname}?modal=AuthModal&variant=${queryParams === "login" ? "recover" : "login"}`}
              variant="link">
              {queryParams === "login" ? "Forgot password?" : "Remember password?"}
            </Button>}
          </div>

          <Button variant="default-outline" disabled={isSubmitting}>
            {queryParams === "login" ? "Login" 
            : queryParams === "register" ? "Register" :
              queryParams === 'reset-password' ? "Reset password" : "Send email"}
          </Button>
          <div className="flex justify-center text-center">{responseMessage}</div>
        </form>

        {/* CONTINUE WITH (for login and register only) */}
        {(queryParams === "login" || queryParams === 'register')  && (
          <section className="flex flex-col gap-y-4 text-center">
            <p>or continue with</p>
            <div
              className={`grid grid-cols-3 gap-x-2 ${isSubmitting && "opacity-50 cursor-default pointer-events-none"}`}>
              <ContinueWithButton provider="google" />
              <ContinueWithButton provider="faceit" />
              <ContinueWithButton provider="twitter" />
            </div>
            <Button
              className="pr-1"
              href={`${pathname}?modal=AuthModal&variant=${queryParams === "login" ? "register" : "login"}`}
              variant="link">
              {queryParams === "login" ? "Create account" : "Login"}
            </Button>
          </section>
        )}
</> :  <h1>Now change query params back to &variant=login :) </h1>

}


      </div>
    </ModalContainer>
  )
}
