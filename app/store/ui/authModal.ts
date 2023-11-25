import { create } from "zustand"

type AuthModalStore = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  toggle: () => void
}

export const useAuthModal = create<AuthModalStore>((set, get) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))
