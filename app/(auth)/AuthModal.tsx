import { useForm } from "react-hook-form"
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai"

import { AuthInput } from "@/components/ui/Inputs/Validation/AuthInput"
import { ModalContainer } from "@/components/ui/Modals/ModalContainer"
import { useAuthModal } from "@/store/ui/authModal"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import useDarkMode from "@/store/ui/darkModeStore"
import { ContinueWithButton } from "./components/ContinueWithButton"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { pusherClient } from "@/libs/pusher"
import { Timer } from "./components"
import supabaseClient from "@/libs/supabaseClient"
import { TAPIAuthRegister } from "@/api/auth/register/route"

interface FormData {
  email: string
  password: string
  username: string
}

type Variant = "login" | "register" | "recover" | "resetPassword" | "recoverCompleted" | "authCompleted"

export function AuthModal() {
  const router = useRouter()
  const authModal = useAuthModal()

  const [isEmailSent, setIsEmailSent] = useState(false)
  const [variant, setVariant] = useState<Variant>("login")
  const [isChecked, setIsChecked] = useState(false)
  const [isAuthCompleted, setIsAuthCompleted] = useState(false)
  const [isRecoverCompleted, setIsRecoverCompleted] = useState(false)
  const { isDarkMode } = useDarkMode()
  const [responseMessage, setResponseMessage] = useState<React.ReactNode>(<p></p>)

  //when user submit form and got response message from server
  function displayResponseMessage(message: React.ReactNode) {
    setResponseMessage(message)
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setFocus,
    getValues,
    reset,
  } = useForm<FormData>()

  //for case when user click 'Forgot password?' or 'Create account' and some data in responseMessage
  useEffect(() => {
    setResponseMessage(<p></p>)
  }, [variant])

  useEffect(() => {
    //hide response message to prevent overflow because too much errors
    if (errors.email || errors.password || errors.username) {
      displayResponseMessage(<p></p>)
    }
  }, [errors.email, errors.password, errors.username])

  useEffect(() => {
    if (isAuthCompleted) setVariant("authCompleted")
  }, [isAuthCompleted, router])

  // Show 'Auth completed' message if user verified email
  useEffect(() => {
    function authCompletedHandler() {
      setIsAuthCompleted(true)
      reset()
      setIsEmailSent(false)
      setTimeout(() => {
        // this timeout required to set avatarUrl
        router.refresh()
      }, 250)
    }

    pusherClient.bind("auth:completed", authCompletedHandler)
    return () => {
      if (getValues("email")) {
        pusherClient.unsubscribe(getValues("email"))
      }
      pusherClient.unbind("auth:completed", authCompletedHandler)
    }
  }, [getValues, reset, router])

  async function signUp(username: string, email: string, password: string) {
    try {
      const signUpResponse = await axios
        .post("/api/auth/register", {
          username: username,
          email: email,
          password: password,
        } as TAPIAuthRegister)
        .catch(error => {
          throw error
        })

      setIsEmailSent(true)
      if (getValues("email")) {
        // subscribe pusher to email channel to show message like 'auth completed'
        pusherClient.subscribe(getValues("email"))
      }
      setResponseMessage(<p className="text-success">Check your email</p>)
      setTimeout(() => {
        setResponseMessage(
          <div className="flex flex-col">
            <div className="flex flex-row">
              <p>Don&apos;t revice email?&nbsp;</p>
              <Timer label="resend in" seconds={20}>
                <Button type="button" variant="link" onClick={() => resendVerificationEmail(email)}>
                  resend
                </Button>
              </Timer>
            </div>
            <Button
              className="text-brand"
              variant="link"
              type="button"
              onClick={() => {
                setIsEmailSent(false)
                setTimeout(() => {
                  setFocus("email")
                }, 50)
              }}>
              change email
            </Button>
          </div>
        )
      }, 5000)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.error === "User exists - check your email\n You might not verified your email") {
          displayResponseMessage(
            <div className="flex flex-col justify-center items-center">
              <p className="text-danger">User exists - check your email</p>
              <p className="text-danger">You might not verified your email</p>
            </div>
          )
        } else {
          displayResponseMessage(<p className="text-danger">{error.response?.data.error}</p>)
        }
      } else if (error instanceof Error) {
        displayResponseMessage(<p className="text-danger">{error.message}</p>)
      } else {
        displayResponseMessage(
          <div className="text-danger flex flex-row">
            <p>An unknown error occurred - contact admin&nbsp;</p>
            <Button className="text-info" href="https://t.me/nicitaacom" variant="link">
              here
            </Button>
          </div>
        )
      }
    }
  }

  async function resendVerificationEmail(email: string) {
    try {
      const { error: resendError } = await supabaseClient.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback/credentials`,
        },
      })
      if (resendError) throw resendError

      displayResponseMessage(
        <div className="flex flex-col">
          <div className="text-success flex flex-row justify-center">
            <p>Email resended -&nbsp;</p>
            <Button
              className="text-brand"
              variant="link"
              type="button"
              onClick={() => {
                setIsEmailSent(false)
                setTimeout(() => {
                  setFocus("email")
                }, 50)
              }}>
              change email
            </Button>
          </div>
          <p>If you don&apos;t recieve an email - check &apos;Spam&apos; and &apos;All mail&apos;</p>
        </div>
      )
    } catch (error) {
      if (error instanceof Error) {
        displayResponseMessage(<p className="text-danger">{error.message}</p>)
      } else {
        displayResponseMessage(
          <div className="text-danger flex flex-row">
            <p>An unknown error occurred - contact admin&nbsp;</p>
            <Button className="text-info" href="https://t.me/nicitaacom" variant="link">
              here
            </Button>
          </div>
        )
      }
    }
  }

  function closeModal() {
    if (isAuthCompleted || isRecoverCompleted) {
      setVariant("login")
      setIsAuthCompleted(false)
      setIsRecoverCompleted(false)
      displayResponseMessage(<p></p>)
      authModal.closeModal()
    } else {
      authModal.closeModal()
    }
  }

  const onSubmit = async (data: FormData) => {
    if (variant === "login") {
      // await signInWithPassword(data.email, data.password)
    } else if (variant === "register") {
      await signUp(data.username, data.email, data.password)
    } else if (variant === "recover") {
      router.refresh()
      // await recoverPassword(data.email)
      reset()
    } else if (variant === "resetPassword") {
      // resetPassword(data.password)
    }
  }

  return (
    <ModalContainer
      className={twMerge(
        `w-[500px] transition-all duration-300`,
        variant === "login"
          ? "h-[560px]"
          : variant === "register"
          ? "h-[640px]"
          : variant === "resetPassword"
          ? "h-[310px]"
          : "h-[290px]",

        //for login height when errors x1
        variant === "login" && (errors.email || errors.password) && "!h-[570px]",
        //for login height when errors x2
        variant === "login" && errors.password && errors.email && "!h-[590px]",

        //for register height when errors
        variant === "register" && (errors.email || errors.password || errors.username) && "!h-[660px]",
        //for register height when errors x2
        variant === "register" && errors.email && errors.password && "!h-[680px]",
        //for register height when errors x3
        variant === "register" && errors.email && errors.password && errors.username && "!h-[700px]",

        //for recover height when errors
        variant === "recover" && errors.email && "!h-[320px]",

        //for resetPassword height when errors
        variant === "resetPassword" && errors.password && "!h-[390px]",

        //for auth completed height
        variant === "authCompleted" && "!h-[250px]"
      )}
      isOpen={authModal.isOpen}
      onClose={closeModal}>
      <div className="flex flex-col justify-center gap-y-2 mx-auto">
        <div
          className={twMerge(
            `flex flex-row gap-x-4 items-center w-full`,
            isAuthCompleted ? "justify-center" : "justify-start",
            (variant === "login" || variant === "register") && "mb-8",
            (errors.email || errors.password) && "!mb-4"
          )}>
          <Image
            className={twMerge(`${isAuthCompleted || isRecoverCompleted ? "w-[48px] h-[48px]" : "w-[57px] h-[40px]"}`)}
            src={
              isAuthCompleted
                ? isDarkMode
                  ? "/authentication-completed-dark.png"
                  : "/authentication-completed-light.png"
                : isRecoverCompleted
                ? isDarkMode
                  ? "/recover-completed-dark.png"
                  : "/recover-completed-light.png"
                : isDarkMode
                ? "/logo-dark.png"
                : "/logo-light.png"
            }
            alt="logo"
            width={64}
            height={64}
          />
          <h1 className="text-4xl font-bold">
            {variant === "login"
              ? "Login"
              : variant === "register"
              ? "Register"
              : variant === "recover"
              ? "Recover"
              : variant === "resetPassword"
              ? "Reset pasword"
              : variant === "recoverCompleted"
              ? "Recover completed"
              : "Auth completed"}
          </h1>
        </div>

        {variant === "login" || variant === "register" || variant === "recover" || variant === "resetPassword" ? (
          <>
            <form
              className="relative max-w-[450px] w-[75vw] flex flex-col gap-y-2 mb-4"
              onSubmit={handleSubmit(onSubmit)}>
              {variant !== "resetPassword" && (
                <AuthInput
                  endIcon={<AiOutlineMail size={24} />}
                  register={register}
                  errors={errors}
                  id="email"
                  label="Email"
                  placeholder="user@big.com"
                  disabled={isSubmitting || isEmailSent}
                  required
                />
              )}
              {variant !== "recover" && (
                <AuthInput
                  endIcon={<AiOutlineLock size={24} />}
                  register={register}
                  errors={errors}
                  id="password"
                  label="Password"
                  type="password"
                  placeholder={
                    variant === "register" || variant === "resetPassword" ? "NeW-RaNd0m_PasWorD" : "RaNd0m_PasWorD"
                  }
                  disabled={isSubmitting || isEmailSent}
                  required
                />
              )}
              {variant === "register" && (
                <AuthInput
                  endIcon={<AiOutlineUser size={24} />}
                  register={register}
                  errors={errors}
                  id="username"
                  label="Username"
                  placeholder="HANTARESpeek"
                  disabled={isSubmitting || isEmailSent}
                  required
                />
              )}
              <div className="flex justify-between mb-2">
                <div className={twMerge(`invisible`, variant === "login" && "visible")}>
                  <Checkbox
                    className="bg-background cursor-pointer"
                    label="Remember me"
                    onChange={() => setIsChecked(isChecked => !isChecked)}
                    isChecked={isChecked}
                  />
                </div>
                {variant !== "register" && (
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => setVariant(variant === "login" ? "recover" : "login")}>
                    {variant === "login" ? "Forgot password?" : "Remember password?"}
                  </Button>
                )}
              </div>
              <Button variant="default-outline" type="submit" disabled={isSubmitting || isEmailSent}>
                {variant === "login"
                  ? "Login"
                  : variant === "register"
                  ? "Register"
                  : variant === "recover" || variant === "resetPassword"
                  ? "Reset password"
                  : "Send email"}
              </Button>
              <div className="flex justify-center text-center">{responseMessage}</div>
            </form>
            {/* CONTINUE WITH (for login and register only) */}
            {(variant === "login" || variant === "register") && (
              <section className="flex flex-col gap-y-4 text-center">
                <p>or continue with</p>
                <div
                  className={`grid grid-cols-3 gap-x-2 ${
                    isSubmitting && "opacity-50 cursor-default pointer-events-none"
                  }`}>
                  <ContinueWithButton provider="google" />
                  <ContinueWithButton provider="faceit" />
                  <ContinueWithButton provider="twitter" />
                </div>
                <Button
                  className={twMerge(`pr-1`, isEmailSent && "opacity-50 pointer-events-none cursor-default")}
                  onClick={() => setVariant(variant === "login" ? "register" : "login")}
                  variant="link"
                  disabled={isEmailSent}>
                  {variant === "login" ? "Create account" : "Login"}
                </Button>
              </section>
            )}
          </>
        ) : variant === "authCompleted" && isAuthCompleted === true ? (
          <div className="text-success flex flex-col justify-center w-full h-[150px]">
            <p className="text-success text-center text-xl">Mission passed!</p>
            <p className="text-success text-center">respect+</p>
          </div>
        ) : variant === "recoverCompleted" && isRecoverCompleted === true ? (
          <div className="text-success flex flex-col justify-center gap-y-2 w-full h-[150px]">
            <p className="text-success text-center text-xl">Recover completed</p>
            <p className="text-success text-center">Stay safe!</p>
          </div>
        ) : (
          <h1 className="w-full h-[125px] flex justify-center items-center">
            Now change query params back to &variant=login :)
          </h1>
        )}
      </div>
    </ModalContainer>
  )
}
