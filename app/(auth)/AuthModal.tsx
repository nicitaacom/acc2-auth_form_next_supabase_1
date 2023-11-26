import { useForm } from "react-hook-form"
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai"

import { AuthInput } from "@/components/ui/Inputs/Validation/AuthInput"
import { ModalContainer } from "@/components/ui/Modals/ModalContainer"
import { useAuthModal } from "@/store/ui/authModal"
import { useState } from "react"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import useDarkMode from "@/store/ui/darkModeStore"

interface FormData {
  email: string
  password: string
  username: string
}

type Variant = "login" | "register" | "recover" | "resetPassword" | "recoverCompleted" | "authCompleted"

export function AuthModal() {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [variant, setVariant] = useState<Variant>("login")
  const [isChecked, setIsChecked] = useState(false)
  const [isAuthCompleted, setIsAuthCompleted] = useState(false)
  const [isRecoverCompleted, setIsRecoverCompleted] = useState(false)
  const { isDarkMode } = useDarkMode()

  const nameModal = useAuthModal()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setFocus,
    getValues,
    reset,
  } = useForm<FormData>()

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
      isOpen={nameModal.isOpen}
      onClose={nameModal.closeModal}>
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
            <form className="relative max-w-[450px] w-[75vw] flex flex-col gap-y-2 mb-4">
              <AuthInput
                endIcon={<AiOutlineMail size={24} />}
                register={register}
                errors={errors}
                disabled={isSubmitting || isEmailSent}
                id="email"
                type="email"
                label="Email"
                placeholder="user@big.com"
                required
              />
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
                  <Button variant="link" onClick={() => setVariant(variant === "login" ? "recover" : "login")}>
                    {variant === "login" ? "Forgot password?" : "Remember password?"}
                  </Button>
                )}
              </div>
            </form>
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
