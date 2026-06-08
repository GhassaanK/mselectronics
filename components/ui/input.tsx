import * as React from "react"
import { cn } from "@/lib/utils/cn"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn("h-11 w-full rounded-md border bg-background px-md text-sm outline-none transition duration-premium placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15", className)}
    {...props}
  />
))
Input.displayName = "Input"
