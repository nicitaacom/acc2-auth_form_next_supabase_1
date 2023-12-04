# How to reuse/implement modals based on global state

## Step 1 (in this folder)

```tsx
export function NameModal() {
  const nameModal = useNameModal()

  return (
    <ModalContainer className="relative w-full max-w-[450px]" isOpen={nameModal.isOpen} onClose={nameModal.closeModal}>
      <div>any content for modal based on state here</div>
    </ModalContainer>
  )
}
```

## Step 2

Export `NameModal.tsx` in `index.ts`

## Step 3 (in /app/store/ui)

```ts
import { create } from "zustand"

type CtrlKModalStore = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  toggle: () => void
}

export const useCtrlKModal = create<CtrlKModalStore>((set, get) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))
```

You you don't need toggle - just delete it
If you need to pass some props in `openModal` just add it like so

```ts
  openModal: (id: string, title: string) => void
```

## Step 4 (in /app/providers)

Render your modal here

```tsx
<CtrlKModal />
```
