import React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "success" | "warning" | "error"
}

export function Alert({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) {
  const baseClasses = "rounded-md p-4 text-sm"
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    info: "bg-blue-50 text-blue-800",
    success: "bg-green-50 text-green-800",
    warning: "bg-amber-50 text-amber-800",
    error: "bg-rose-50 text-rose-800",
  }
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 