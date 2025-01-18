import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./rainbow-button.module.css"

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function RainbowButton({
  children,
  className,
  disabled,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors",
        "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
        "hover:from-blue-600 hover:via-blue-700 hover:to-blue-800",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        styles.gradientMove,
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
} 