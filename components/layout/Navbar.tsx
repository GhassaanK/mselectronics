"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { brandConfig } from "@/config/brand"
import { useCart } from "@/hooks/useCart"

const nav = [
  { href: "/shop",       label: "Shop" },
  { href: "/brands",     label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/about",      label: "About" },
  { href: "/contact",    label: "Contact" },
]

export function Navbar() {
  const { count } = useCart()
  const pathname  = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
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
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/8 shadow-[0_4px_30px_rgb(0,0,0,0.3)] backdrop-blur-xl"
            : "border-b border-white/10 backdrop-blur-sm",
        ].join(" ")}
        style={{ background: `rgb(var(--navy) / ${scrolled ? "0.97" : "1"})` }}
      >
        <div className="container-page flex h-[68px] items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" aria-label={brandConfig.companyName} className="flex shrink-0 items-center">
            {brandConfig.logo ? (
              <Image
                src={brandConfig.logo}
                alt={brandConfig.companyName}
                width={180}
                height={44}
                priority
                className="h-9 w-auto brightness-0 invert"
              />
            ) : (
              <span className="font-display text-lg font-extrabold text-white">
                {brandConfig.companyName}
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                    active
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/8",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full"
                      style={{ background: "rgb(var(--blue-light))" }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            <Link
              href="/shop"
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              <Search size={18} />
            </Link>

            <Link
              href="/cart"
              aria-label="Inquiry cart"
              className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: "rgb(var(--blue))",
                boxShadow: "0 4px 16px rgb(var(--blue) / 0.4)",
                fontFamily: "'Sora', sans-serif",
              }}
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Inquiry</span>
              {count > 0 && (
                <span
                  className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white"
                  style={{ background: "rgb(var(--accent))" }}
                >
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/10 hover:text-white md:hidden"
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
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <div
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-80 flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ background: "rgb(var(--navy))" }}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-white/10 px-6">
          <span className="font-display text-sm font-semibold uppercase tracking-widest text-white/50">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {nav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200",
                  active ? "text-white" : "text-white/60 hover:bg-white/8 hover:text-white",
                ].join(" ")}
                style={active ? { background: "rgb(var(--blue) / 0.2)", fontFamily: "'Sora', sans-serif" } : { fontFamily: "'Sora', sans-serif" }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 p-6">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "rgb(var(--blue))", boxShadow: "0 4px 16px rgb(var(--blue) / 0.4)", fontFamily: "'Sora', sans-serif" }}
          >
            <ShoppingBag size={16} />
            View Inquiry Cart {count > 0 && `(${count})`}
          </Link>
        </div>
      </div>
    </>
  )
}