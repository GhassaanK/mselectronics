"use client"

import { useEffect, useState } from "react"
import { Facebook, Instagram } from "lucide-react"
import { brandConfig } from "@/config/brand"

const messages = [
  "25+ years of excellence in top-quality appliances",
  "Shop ACs, washers, fans & more",
  "Official warranty on every product",
]

function WhatsAppIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const socialLinks = [
  { href: brandConfig.socialLinks?.facebook  ?? "#", label: "Facebook",  icon: <Facebook size={13} /> },
  { href: brandConfig.socialLinks?.instagram ?? "#", label: "Instagram", icon: <Instagram size={13} /> },
  { href: `https://wa.me/${brandConfig.contactInfo.phone?.replace(/\D/g, "")}`, label: "WhatsApp", icon: <WhatsAppIcon size={13} /> },
]

function SocialIcons({ small = false }: { small?: boolean }) {
  const sz = small ? "h-6 w-6" : "h-7 w-7"
  return (
    <div className="flex items-center gap-1.5">
      {socialLinks.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`${sz} flex items-center justify-center rounded-full border border-[#CCCCCC] text-[#525252] transition hover:border-[#111111] hover:bg-[#111111] hover:text-white`}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

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
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const message = (
    <span
      className="text-xs font-medium text-[#333333] transition-opacity duration-250"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {messages[idx]}
    </span>
  )

  return (
    <div className="border-b border-[#E5E5E5] bg-gray">

      {/* Mobile: message only, centered */}
      <div className="flex h-9 items-center justify-center sm:hidden">
        {message}
      </div>

      {/* Tablet (sm–lg): phone left · message center · socials right */}
      <div className="hidden sm:flex lg:hidden h-9 items-center justify-between px-4">
        <a
          href={`tel:${brandConfig.contactInfo.phone}`}
          className="text-xs font-medium text-[#333333] transition-colors hover:text-[#111111]"
        >
          {brandConfig.contactInfo.phone}
        </a>
        {message}
        <SocialIcons small />
      </div>

      {/* Desktop (lg+): phone+email left · message center · socials right */}
      <div className="container-page hidden lg:grid h-10 grid-cols-3 items-center">
        <div className="flex items-center gap-4">
          <a
            href={`tel:${brandConfig.contactInfo.phone}`}
            className="text-xs font-medium text-[#333333] transition-colors hover:text-[#111111]"
          >
            {brandConfig.contactInfo.phone}
          </a>
          <span className="text-[#DDDDDD] select-none">|</span>
          <a
            href={`mailto:${brandConfig.contactInfo.email}`}
            className="text-xs font-medium text-[#333333] transition-colors hover:text-[#111111]"
          >
            {brandConfig.contactInfo.email}
          </a>
        </div>

        <div className="flex justify-center">{message}</div>

        <div className="flex justify-end">
          <SocialIcons />
        </div>
      </div>

    </div>
  )
}