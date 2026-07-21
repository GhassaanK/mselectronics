"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FolderTree,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Tags,
} from "lucide-react"
import { AdminGuard, signOut } from "@/components/admin/AdminGuard"
import { brandConfig } from "@/config/brand"

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AdminGuard>
      <div data-admin-shell className="h-dvh overflow-hidden bg-[#F7F8FA]">
        <div className="container-page flex h-full min-h-0 flex-col gap-3 py-3 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-5 lg:py-5">
          <aside className="shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white shadow-sm lg:sticky lg:top-5 lg:self-start">
            <div className="border-b border-[#E5E5E5] p-4">
              {brandConfig.logo ? (
                <Image
                  src={brandConfig.logo}
                  alt={brandConfig.companyName}
                  width={132}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <span className="text-sm font-bold text-[#111111]">
                  {brandConfig.companyName}
                </span>
              )}
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#737373]">
                Content management
              </p>
            </div>

            <nav className="grid max-h-[32vh] gap-1 overflow-y-auto p-3 lg:max-h-none">
              {nav.map((item) => {
                const Icon = item.icon
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-all",
                      active
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-[#525252] hover:bg-[#F2F2F2] hover:text-[#111111]",
                    ].join(" ")}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="grid gap-1 border-t border-[#E5E5E5] p-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-[#737373] transition hover:bg-[#F8F8F8] hover:text-[#111111]"
              >
                <Home size={16} />
                View storefront
              </Link>

              <button
                type="button"
                onClick={() => void signOut()}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-[#737373] transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </aside>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
