import { ModalContainer } from "@/components/ui/Modals/ModalContainer"
import { useAuthModal } from "@/store/ui/authModal"

export function AuthModal() {
  const nameModal = useAuthModal()

  return (
    <ModalContainer className="relative w-full max-w-[450px]" isOpen={nameModal.isOpen} onClose={nameModal.closeModal}>
      <div>some content here</div>
    </ModalContainer>
  )
}
