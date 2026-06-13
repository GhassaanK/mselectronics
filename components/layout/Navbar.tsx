"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { brandConfig } from "@/config/brand"
import { useCart } from "@/hooks/useCart"

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const { count } = useCart()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 bg-white transition-all duration-200",
          scrolled
            ? "border-b border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.06)]"
            : "border-b border-gray-100",
        ].join(" ")}
      >
        <div className="container-page flex h-[84px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            aria-label={brandConfig.companyName}
            className="flex items-center"
          >
            <img
              src={brandConfig.logo}
              alt={brandConfig.companyName}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative px-4 py-2 text-sm font-medium rounded transition-colors duration-150",
                    active
                      ? "text-[#111111] font-semibold"
                      : "text-[#525252] hover:text-[#111111]",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#111111]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">

            <Link
              href="/shop"
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded text-[#525252] transition-colors hover:bg-gray-100 hover:text-[#111111]"
            >
              <Search size={18} />
            </Link>

            <Link
              href="/cart"
              aria-label="Inquiry cart"
              className="relative flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-[#111111] transition-colors hover:bg-gray-100"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Inquiry</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded text-[#525252] transition-colors hover:bg-gray-100 hover:text-[#111111] md:hidden"
            >
              <Menu size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className={[
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <div
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-gray-100 px-5">
          <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-3">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-gray-100 text-[#111111] font-semibold"
                    : "text-[#525252] hover:bg-gray-50 hover:text-[#111111]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100 p-5">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#262626]"
          >
            <ShoppingBag size={16} />
            View Inquiry Cart {count > 0 && `(${count})`}
          </Link>
        </div>
      </div>
    </>
  )
}