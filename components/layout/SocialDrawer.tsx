"use client"

import { useEffect, useState } from "react"
import {
  ChevronRight,
  ChevronLeft,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react"
import { brandConfig } from "@/config/brand"

const STORAGE_KEY = "ms-electronics-social-drawer"

type SocialLink = {
  label: string
  href: string
  icon: typeof Facebook
  bg: string
  hoverBg: string
}

export function SocialDrawer() {
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Respect a previously dismissed state, but default to OPEN for first-time visitors.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "closed") setOpen(false)
    setMounted(true)
  }, [])

  function toggle() {
    const next = !open
    setOpen(next)
    window.localStorage.setItem(STORAGE_KEY, next ? "open" : "closed")
  }

  const links: SocialLink[] = [
    {
      label: "Facebook",
      href: brandConfig.socialLinks.facebook || "https://facebook.com",
      icon: Facebook,
      bg: "bg-[#1877F2]",
      hoverBg: "hover:bg-[#0F5FCB]",
    },
    {
      label: "Instagram",
      href: brandConfig.socialLinks.instagram || "https://instagram.com",
      icon: Instagram,
      bg: "bg-[#E4405F]",
      hoverBg: "hover:bg-[#C9304C]",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${brandConfig.whatsappNumber.replace(/\D/g, "")}`,
      icon: MessageCircle,
      bg: "bg-[#25D366]",
      hoverBg: "hover:bg-[#1FB855]",
    },
  ]

  // Avoid a flash of the wrong state before localStorage is read on mount.
  if (!mounted) return null

  return (
    <div
      className="fixed left-0 top-1/2 z-40 -translate-y-1/2"
      role="complementary"
      aria-label="Social links"
    >
      <div className="relative flex items-stretch">
        {/* Icon rail — slides in from behind the handle */}
        <div
          className={[
            "flex flex-col items-center gap-2 overflow-hidden rounded-r-2xl border border-l-0 border-[#E8ECF4] bg-white py-3 shadow-[2px_0_16px_rgba(10,15,30,0.08)] transition-all duration-300 ease-out",
            open ? "max-w-[64px] px-2.5 opacity-100" : "max-w-0 px-0 opacity-0",
          ].join(" ")}
          aria-hidden={!open}
        >
          {links.map(({ label, href, icon: Icon, bg, hoverBg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              tabIndex={open ? 0 : -1}
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110",
                bg,
                hoverBg,
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={2} fill={label === "Facebook" || label === "Instagram" ? "white" : "none"} />
            </a>
          ))}
        </div>

        {/* Handle — always visible, toggles the rail */}
        <button
          onClick={toggle}
          aria-label={open ? "Hide social links" : "Show social links"}
          aria-expanded={open}
          className="flex h-16 w-6 shrink-0 items-center justify-center rounded-r-lg bg-[#0A0F1E] text-white transition-colors duration-200 hover:bg-[#162033]"
        >
          {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  )
}