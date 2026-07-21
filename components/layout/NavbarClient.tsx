"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react"

import { brandConfig } from "@/config/brand"
import { useCart } from "@/hooks/useCart"
import type { Brand, Category } from "@/types"

const staticLinks = [
  { href: "/about",   label: "About"   },
  { href: "/contact", label: "Contact" },
]

type Props = {
  categories: Category[]
  brands: Brand[]
}

type OpenMenu = "shop" | "brands" | null

export function NavbarClient({ categories, brands }: Props) {
  const pathname  = usePathname()
  const { count } = useCart()

  const [scrolled,  setScrolled]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu,  setOpenMenu]  = useState<OpenMenu>(null)
  const [mobileExpanded, setMobileExpanded] = useState<"shop" | "brands" | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Scroll shadow ──────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Close on route change ──────────────────────────────
  useEffect(() => {
    setMobileOpen(false)
    setOpenMenu(null)
  }, [pathname])

  // ── Body scroll lock ───────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // ── Click outside to close ─────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleMenuEnter(menu: OpenMenu) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(menu)
  }

  function handleMenuLeave() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const featuredBrands = brands.filter((b) => b.featured).slice(0, 8)
  const allBrands      = brands.filter((b) => !b.featured).slice(0, 12)

  return (
    <>
      <header
        ref={menuRef}
        className={[
          "sticky top-0 z-50 bg-white transition-shadow duration-200",
          scrolled ? "shadow-[0_2px_12px_rgb(0,0,0,0.07)]" : "border-b border-[#E5E5E5]",
        ].join(" ")}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-[68px] sm:gap-4">

          {/* ── Logo ──────────────────────────────────── */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src={brandConfig.logo}
              alt={brandConfig.companyName}
              width={160}
              height={64}
              className="h-11 w-auto object-contain sm:h-14"
            />
          </Link>

          {/* ── Desktop nav ───────────────────────────── */}
          <nav className="hidden items-center xl:flex">

            {/* Shop dropdown trigger */}
            <div
              onMouseEnter={() => handleMenuEnter("shop")}
              onMouseLeave={handleMenuLeave}
              className="relative"
            >
              <button
                className={[
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-150",
                  openMenu === "shop" ? "text-[#111111]" : "text-[#525252] hover:text-[#111111]",
                ].join(" ")}
              >
                Shop
                <ChevronDown
                  size={13}
                  className={[
                    "transition-transform duration-200",
                    openMenu === "shop" ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
            </div>

            {/* Brands dropdown trigger */}
            <div
              onMouseEnter={() => handleMenuEnter("brands")}
              onMouseLeave={handleMenuLeave}
              className="relative"
            >
              <button
                className={[
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-150",
                  openMenu === "brands" ? "text-[#111111]" : "text-[#525252] hover:text-[#111111]",
                ].join(" ")}
              >
                Brands
                <ChevronDown
                  size={13}
                  className={[
                    "transition-transform duration-200",
                    openMenu === "brands" ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
            </div>

            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#525252] transition-colors hover:text-[#111111]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ─────────────────────────── */}
          <div className="flex items-center gap-1">
            <Link
              href="/shop"
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded text-[#525252] transition-colors hover:bg-[#F2F2F2] hover:text-[#111111]"
            >
              <Search size={17} />
            </Link>

            <Link
              href="/cart"
              className="flex h-9 items-center gap-2 rounded border border-[#E5E5E5] px-2.5 text-sm font-semibold text-[#111111] transition-all hover:bg-[#F8F8F8] sm:px-3.5"
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Inquiry</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded text-[#525252] transition-colors hover:bg-[#F2F2F2] xl:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── Mega-menu panel ───────────────────────── */}
        {openMenu && (
          <div
            onMouseEnter={() => handleMenuEnter(openMenu)}
            onMouseLeave={handleMenuLeave}
            className="absolute left-0 right-0 top-full z-40 border-t border-[#E5E5E5] bg-white shadow-[0_16px_40px_rgb(0,0,0,0.10)]"
          >
            <div className="container-page py-8">

              {/* ── Shop panel ── */}
              {openMenu === "shop" && (
                <div className="grid grid-cols-[200px_1fr] gap-10">

                  {/* Left: overview links */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
                      Shop
                    </p>
                    <Link
                      href="/shop"
                      className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F8F8F8]"
                      onClick={() => setOpenMenu(null)}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/categories"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#525252] transition-colors hover:bg-[#F8F8F8] hover:text-[#111111]"
                      onClick={() => setOpenMenu(null)}
                    >
                      All Categories
                    </Link>
                  </div>

                  {/* Right: category grid */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
                      Browse by Category
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.slug}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F8F8F8]"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span className="text-sm text-[#333333]">{cat.name}</span>
                          <span className="text-[11px] text-[#AAAAAA]">{cat.productCount}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Brands panel ── */}
              {openMenu === "brands" && (
                <div className="grid grid-cols-[200px_1fr] gap-10">

                  {/* Left: overview */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
                      Brands
                    </p>
                    <Link
                      href="/brands"
                      className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F8F8F8]"
                      onClick={() => setOpenMenu(null)}
                    >
                      All Brands
                    </Link>
                  </div>

                  {/* Right: featured + rest */}
                  <div className="space-y-5">
                    {featuredBrands.length > 0 && (
                      <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
                          Featured
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {featuredBrands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/shop?brand=${brand.slug}`}
                              className="rounded-lg border border-[#E5E5E5] bg-[#F8F8F8] px-4 py-2 text-sm font-semibold text-[#111111] transition-all hover:border-[#111111] hover:bg-white"
                              onClick={() => setOpenMenu(null)}
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {allBrands.length > 0 && (
                      <div>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#AAAAAA]">
                          More Brands
                        </p>
                        <div className="grid grid-cols-4 gap-1">
                          {allBrands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/shop?brand=${brand.slug}`}
                              className="rounded-lg px-3 py-2 text-sm text-[#525252] transition-colors hover:bg-[#F8F8F8] hover:text-[#111111]"
                              onClick={() => setOpenMenu(null)}
                            >
                              {brand.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </header>

      {/* ── Mobile overlay ──────────────────────────────── */}
      <div
        onClick={() => setMobileOpen(false)}
        className={[
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-200 xl:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* ── Mobile drawer ───────────────────────────────── */}
      <div
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-[min(340px,calc(100vw-2rem))] flex-col bg-white transition-transform duration-300 xl:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex h-[68px] items-center justify-between border-b border-[#E5E5E5] px-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA]">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded text-[#888888] transition hover:bg-[#F2F2F2]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto">

          {/* Shop accordion */}
          <div className="border-b border-[#F2F2F2]">
            <button
              onClick={() => setMobileExpanded(mobileExpanded === "shop" ? null : "shop")}
              className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold text-[#111111]"
            >
              Shop
              <ChevronDown
                size={14}
                className={[
                  "text-[#AAAAAA] transition-transform duration-200",
                  mobileExpanded === "shop" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            {mobileExpanded === "shop" && (
              <div className="pb-2">
                <Link
                  href="/shop"
                  className="block px-7 py-2 text-sm font-medium text-[#111111] hover:bg-[#F8F8F8]"
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="block px-7 py-2 text-sm text-[#525252] hover:bg-[#F8F8F8]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Brands accordion */}
          <div className="border-b border-[#F2F2F2]">
            <button
              onClick={() => setMobileExpanded(mobileExpanded === "brands" ? null : "brands")}
              className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold text-[#111111]"
            >
              Brands
              <ChevronDown
                size={14}
                className={[
                  "text-[#AAAAAA] transition-transform duration-200",
                  mobileExpanded === "brands" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            {mobileExpanded === "brands" && (
              <div className="pb-2">
                <Link
                  href="/brands"
                  className="block px-7 py-2 text-sm font-medium text-[#111111] hover:bg-[#F8F8F8]"
                >
                  All Brands
                </Link>
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/shop?brand=${brand.slug}`}
                    className="block px-7 py-2 text-sm text-[#525252] hover:bg-[#F8F8F8]"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Flat links */}
          {[
            { href: "/categories", label: "Categories" },
            { href: "/about",      label: "About"      },
            { href: "/contact",    label: "Contact"    },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border-b border-[#F2F2F2] px-5 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F8F8F8]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart CTA */}
        <div className="border-t border-[#E5E5E5] p-4">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 rounded bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            <ShoppingBag size={16} />
            View Inquiry Cart {count > 0 && `(${count})`}
          </Link>
        </div>
      </div>
    </>
  )
}
