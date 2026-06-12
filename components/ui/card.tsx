import * as React from "react"
import { cn } from "@/lib/utils/cn"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E5E5] bg-white shadow-[0_1px_4px_rgb(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  )
}