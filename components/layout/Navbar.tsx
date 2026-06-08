"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { brandConfig } from "@/config/brand"
import { useCart } from "@/hooks/useCart"

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
]

export function Navbar() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-md">
        <Link href="/" className="flex items-center gap-sm" aria-label={brandConfig.companyName}>
          <Image src={brandConfig.logo} alt={brandConfig.companyName} width={180} height={44} priority className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-lg md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted transition duration-premium hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-sm">
          <Button asChild variant="ghost" size="icon" aria-label="Search products">
            <Link href="/shop"><Search size={19} /></Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/cart" className="relative">
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Inquiry</span>
              {count > 0 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-xs text-xs text-white">{count}</span> : null}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu size={20} /></Button>
        </div>
      </div>
    </header>
  )
}
