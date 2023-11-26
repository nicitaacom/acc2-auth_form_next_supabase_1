"use client"

import { useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { useSwipeable } from "react-swipeable"
import { AnimatePresence, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

interface ModalContainerProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  className?: string
  classnameContainer?: string
  label?: string | React.ReactNode
  children: React.ReactNode
}

export function ModalContainer({
  isOpen,
  isLoading,
  onClose,
  className,
  classnameContainer,
  label,
  children,
}: ModalContainerProps) {
  //correct way to add event listener to listen keydown
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  /* onClose - close modal - show scrollbar */
  function closeModal() {
    onClose()
  }

  //Close modal on esc
  const handleKeyDown = (event: KeyboardEvent) => {
    //TODO - block esc key if isLoading (in ModalContainer.tsx)
    if (event.key === "Escape" && !isLoading) {
      closeModal()
    }
  }

  /* for e.stopPropagation when mousedown on modal and mouseup on modalBg */
  const modalBgHandler = useSwipeable({
    onTouchStartOrOnMouseDown: () => {
      closeModal()
    },
    trackMouse: true,
  })

  const modalHandler = useSwipeable({
    onTouchStartOrOnMouseDown: e => {
      e.event.stopPropagation()
    },
    trackMouse: true,
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={twMerge(
            `fixed inset-[0] bg-[rgba(0,0,0,0.5)] backdrop-blur z-[49]
         flex justify-center items-center`,
            classnameContainer
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          {...modalBgHandler}>
          <motion.div
            className={`relative bg-foreground border-[1px] border-border-color rounded-md py-8 z-[50] shadow-[0px_0px_4px_8px_rgba(0,0,0,0.3)] ${className}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            {...modalHandler}>
            <IoMdClose
              className={twMerge(
                `absolute right-[0] top-[0] border-b-[1px] border-l-[1px] text-icon-color border-border-color rounded-bl-md cursor-pointer`,
                isLoading && "opacity-50 cursor-default pointer-events-none"
              )}
              size={32}
              onClick={closeModal}
            />
            <div className="flex flex-col gap-y-4 px-4">
              {label && <div className="py-2 text-2xl text-center text-title">{label}</div>}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
