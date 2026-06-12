import * as React from "react"
import { cn } from "@/lib/utils/cn"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded border border-[#E5E5E5] bg-white px-3 text-sm text-[#111111] outline-none transition duration-150 placeholder:text-[#AAAAAA] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"