"use client"

import { useEffect, useState } from "react"
import { Phone, Truck, ShieldCheck, CreditCard } from "lucide-react"
import { brandConfig } from "@/config/brand"

const messages = [
  { icon: Truck, text: "Same-week delivery across Karachi" },
  { icon: ShieldCheck, text: "Official warranty on every product" },
  { icon: CreditCard, text: "Easy installment options available" },
]

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)

      setTimeout(() => {
        setIdx((i) => (i + 1) % messages.length)
        setVisible(true)
      }, 250)
    }, 3500)

    return () => clearInterval(id)
  }, [])

  const { icon: Icon, text } = messages[idx]

  return (
    <div className="border-b border-border bg-brand text-white">
      <div className="container-page flex h-10 items-center justify-between">

        {/* Phone */}
        <a
          href={`tel:${brandConfig.contactInfo.phone}`}
          className="hidden items-center gap-1.5 text-xs font-medium text-white/90 transition-opacity hover:text-white sm:flex"
        >
          <Phone size={11} />
          {brandConfig.contactInfo.phone}
        </a>

        {/* Rotating Message */}
        <div className="flex flex-1 items-center justify-center">
          <span
            className="flex items-center gap-2 text-xs font-semibold text-white transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <Icon size={12} />
            {text}
          </span>
        </div>

        {/* Email */}
        <a
          href={`mailto:${brandConfig.contactInfo.email}`}
          className="hidden items-center gap-1.5 text-xs font-medium text-white/90 transition-opacity hover:text-white sm:flex"
        >
          {brandConfig.contactInfo.email}
        </a>

      </div>
    </div>
  )
}