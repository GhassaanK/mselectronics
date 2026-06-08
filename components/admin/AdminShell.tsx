import Link from "next/link"
import { AdminGuard } from "@/components/admin/AdminGuard"

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/settings", label: "Settings" }
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="container-page grid gap-lg py-xl lg:grid-cols-[220px_1fr]">
        <aside className="rounded-lg bg-surface p-md">
          <nav className="grid gap-xs">
            {nav.map((item) => <Link key={item.href} href={item.href} className="rounded-sm px-md py-sm text-sm font-semibold hover:bg-background">{item.label}</Link>)}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </AdminGuard>
  )
}
