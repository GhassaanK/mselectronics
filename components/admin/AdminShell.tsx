"use client"

import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { AdminGuard, signOut } from "@/components/admin/AdminGuard"
import { brandConfig } from "@/config/brand"
import { ThemeDebugger } from "./ThemeDebugger"

const nav = [
  { href: "/admin", label: "Dashboard", emoji: "📊" },
  { href: "/admin/products", label: "Products", emoji: "📦" },
  { href: "/admin/categories", label: "Categories", emoji: "🗂️" },
  { href: "/admin/brands", label: "Brands", emoji: "🏷️" },
  { href: "/admin/settings", label: "Settings", emoji: "⚙️" },
]

export function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-white admin-theme-debug-target">
        <ThemeDebugger />

        <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">

          <aside className="self-start rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-sm">

            <div className="mb-6 flex items-center gap-3 border-b border-[#E5E5E5] px-2 pb-4">
              {brandConfig.logo ? (
                <Image
                  src={brandConfig.logo}
                  alt={brandConfig.companyName}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-sm font-bold text-[#111111]">
                  {brandConfig.companyName}
                </span>
              )}
            </div>

            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#525252] transition-all hover:bg-[#F8F8F8] hover:text-[#111111]"
                >
                  <span className="text-base leading-none">
                    {item.emoji}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 grid gap-1 border-t border-[#E5E5E5] pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#737373] transition hover:text-[#111111]"
              >
                ← Back to site
              </Link>

              <button
                type="button"
                onClick={() => void signOut()}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#737373] transition hover:text-red-500"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>

          </aside>

          <div className="min-w-0">
            {children}
          </div>

        </div>
      </div>
    </AdminGuard>
  )
}