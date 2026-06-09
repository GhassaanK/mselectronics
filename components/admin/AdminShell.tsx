import Link from "next/link"
import Image from "next/image"
import { AdminGuard } from "@/components/admin/AdminGuard"
import { brandConfig } from "@/config/brand"

const nav = [
  { href: "/admin",            label: "Dashboard",   emoji: "📊" },
  { href: "/admin/products",   label: "Products",    emoji: "📦" },
  { href: "/admin/categories", label: "Categories",  emoji: "🗂️" },
  { href: "/admin/brands",     label: "Brands",      emoji: "🏷️" },
  { href: "/admin/settings",   label: "Settings",    emoji: "⚙️" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-surface">
        <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">

          {/* ── Sidebar ───────────────────────────────────── */}
          <aside className="self-start rounded-2xl border bg-card p-4 shadow-sm">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-3 px-2 pb-4 border-b">
              {brandConfig.logo ? (
                <Image
                  src={brandConfig.logo}
                  alt={brandConfig.companyName}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="font-display text-sm font-bold">{brandConfig.companyName}</span>
              )}
            </div>

            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-all hover:bg-surface hover:text-foreground"
                >
                  <span className="text-base leading-none">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Back to site */}
            <div className="mt-6 border-t pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted transition hover:text-foreground"
              >
                ← Back to site
              </Link>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────── */}
          <div className="min-w-0">{children}</div>

        </div>
      </div>
    </AdminGuard>
  )
}