"use client"

import { MessageCircle } from "lucide-react"
import { logInquiry } from "@/lib/firebase/inquiries"

export function WhatsAppButton({
  href,
  label = "Ask on WhatsApp",
  productIds = [],
  sourcePage = "general",
}: {
  href: string
  label?: string
  productIds?: string[]
  sourcePage?: string
}) {
  async function handleClick() {
    try {
      await logInquiry(productIds, sourcePage)
    } catch {
      // The WhatsApp handoff should still work if analytics logging fails.
    }

    window.location.href = href
  }

  return (
    <button type="button" onClick={handleClick} className="btn-whatsapp">
      <MessageCircle size={17} />
      {label}
    </button>
  )
}
