"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { AnimatePresence, motion } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import { IoMdClose } from "react-icons/io"

interface ModalContainerProps {
  children: React.ReactNode
  modalQuery: string
  className?: string
}

export function ModalContainer({ children, modalQuery, className }: ModalContainerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const queryParams = useSearchParams()

  const showModal = queryParams.getAll("modal").includes(modalQuery)
  const [shouldClose, setShouldClose] = useState(false)

  // Disable scroll and show modal on open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"
      document.body.style.width = "calc(100% - 17px)"
    }
    return () => {
      document.body.removeAttribute("style")
    }
  }, [showModal])

  // Close modal and redirect on close
  const closeModal = useCallback(() => {
    document.body.removeAttribute("style")
    setShouldClose(true)
    setTimeout(() => {
      router.push(pathname)
    }, 500)
  }, [router, pathname])

  if (!showModal) {
    return null
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
      {shouldClose ||
        (showModal && (
          <motion.div
            className="fixed inset-[0] bg-[rgba(0,0,0,0.2)] z-[99]
         flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            {...modalBgHandler}>
            <motion.div
              className={`relative bg-foreground border-[1px] border-border-color rounded-md z-[100] ${className}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              {...modalHandler}>
              <IoMdClose
                className="absolute right-[0] top-[0] border-b-[1px] border-l-[1px] text-icon-color border-border-color rounded-bl-md cursor-pointer"
                size={32}
                onClick={closeModal}
              />
              {children}
            </motion.div>
          </motion.div>
        ))}
    </AnimatePresence>
  )
}
