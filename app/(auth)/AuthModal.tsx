import { useForm } from "react-hook-form"
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from "react-icons/ai"

import { AuthInput } from "@/components/ui/Inputs/Validation/AuthInput"
import { ModalContainer } from "@/components/ui/Modals/ModalContainer"
import { useAuthModal } from "@/store/ui/authModal"
import { useState } from "react"

interface FormData {
  email: string
  password: string
  username: string
}

type Variant = "login" | "register" | "recover" | "resetPassword" | "recoverCompleted" | "authCompleted"

export function AuthModal() {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [variant, setVariant] = useState<Variant>("register")

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
    <ModalContainer className="relative w-full max-w-[450px]" isOpen={nameModal.isOpen} onClose={nameModal.closeModal}>
      <div>
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
          placeholder={variant === "register" || variant === "resetPassword" ? "NeW-RaNd0m_PasWorD" : "RaNd0m_PasWorD"}
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
      </div>
    </ModalContainer>
  )
}
