"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logInquiry } from "@/lib/firebase/inquiries"

export function WhatsAppButton({ href, label = "Ask on WhatsApp", productIds = [], sourcePage = "general" }: { href: string; label?: string; productIds?: string[]; sourcePage?: string }) {
  function handleClick() {
    void Promise.race([
      logInquiry(productIds, sourcePage),
      new Promise((resolve) => setTimeout(resolve, 250))
    ])
    window.location.href = href
  }

  return (
    <Button type="button" variant="accent" onClick={handleClick}>
      <MessageCircle size={18} />
      {label}
    </Button>
  )
}
