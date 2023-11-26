"use client"

import * as React from "react"
import Link from "next/link"
import { VariantProps, cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const buttonVariants = cva(
  `flex items-center justify-center rounded-md hover:brightness-75 
  outline-none disabled:opacity-50 disabled:pointer-events-none transparent-colors duration-300`,
  {
    variants: {
      variant: {
        default: "px-4 py-2 bg-brand font-bold text-title-foreground",
        "default-outline": "px-4 py-2 bg-transparent border-[1px] border-brand text-title",

        info: "px-4 py-2 bg-info font-bold text-title-foreground",
        "info-outline": "px-4 py-2 bg-transparent border-[1px] border-info font-bold text-title",

        warning: "px-4 py-2 bg-warning font-bold text-title-foreground",
        "warning-outline": "px-4 py-2 bg-transparent border-[1px] border-warning font-bold text-title-foreground",

        danger: "px-4 py-2 bg-danger font-bold text-title-foreground",
        "danger-outline": "px-4 py-2 bg-transparent border-[1px] border-danger font-bold text-title",

        success: "px-4 py-2 bg-success font-bold text-title-foreground",
        "success-outline": "px-4 py-2 bg-transparent border-[1px] border-success font-bold text-title",

        "nav-link": `relative w-fit font-bold text-title
          before:absolute before:bottom-[-4px] before:w-full before:content-['']
           before:invisible before:opacity-0 before:translate-y-[0px]
           before:border-b-[3px] before:border-solid before:border-brand before:rounded-md before:transition-all
           before:duration-300 before:pointer-events-none`,
        link: "text-subTitle cursor-pointer hover:text-brand",

        "continue-with":
          "px-2 py-1 w-full font-secondary bg-transparent border-[1px] border-border-color flex justify-center items-center gap-x-4",
      },
      active: {
        active: "before:visible before:opacity-100 before:translate-y-[2px]",
        inactive:
          "hover:before:visible hover:before:opacity-100 before:translate-y-[10px] hover:before:translate-y-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
  target?: "_blank" | "_parent" | "_self" | "_top"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, active, target, disabled, ...props }, ref) => {
    if (href) {
      return (
        <Link href={href} className={twMerge(buttonVariants({ variant, active, className }))} target={target}>
          {children}
        </Link>
      )
    }
    return (
      <button
        className={twMerge(
          buttonVariants({ variant, active, className }),
          disabled ? "opacity-50 cursor-default pointer-events-none" : ""
        )}
        ref={ref}
        {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
