import Link from "next/link"
import {
  Package,
  Tag,
  Layers,
  MessageSquare,
  Image as ImageIcon,
  Palette,
  Settings,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { AdminShell } from "@/components/admin/AdminShell"
import { BannerForm } from "@/components/admin/BannerForm"
import { ThemeForm } from "@/components/admin/ThemeForm"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"
import { getBanners } from "@/lib/firebase/banners"
import { getTheme } from "@/lib/firebase/theme"

export default async function AdminPage() {
  const [products, categories, brands, banners, theme] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getBanners(),
    getTheme(),
  ])

  const inStock   = products.filter((p) => p.availability === "In Stock").length
  const featured  = products.filter((p) => p.featured).length
  const onOrder   = products.filter((p) => p.availability === "On Order").length

  const stats = [
    { label: "Total Products",    value: products.length,    icon: Package,   color: "text-blue-500",  bg: "bg-blue-500/10" },
    { label: "Categories",        value: categories.length,  icon: Layers,    color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Brands",            value: brands.length,      icon: Tag,       color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Recent Inquiries",  value: 0,                  icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
  ]

  const subStats = [
    { label: "In Stock",   value: inStock },
    { label: "Featured",   value: featured },
    { label: "On Order",   value: onOrder },
    { label: "Active Banners", value: banners.filter((b) => b.active).length },
  ]

  const quickLinks = [
    { href: "/admin/products/new", label: "Add Product",    icon: Package },
    { href: "/admin/categories",   label: "Manage Categories", icon: Layers },
    { href: "/admin/brands",       label: "Manage Brands",  icon: Tag },
    { href: "/admin/settings",     label: "Site Settings",  icon: Settings },
  ]

  return (
    <AdminShell>
      <div className="space-y-8">

        {/* ── Header ────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Welcome back. Here's what's happening with your store.</p>
        </div>

        {/* ── Primary stats ─────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Secondary stats row ───────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {subStats.map(({ label, value }) => (
            <div key={label} className="rounded-xl border bg-surface px-4 py-3">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-1 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Quick links ───────────────────────────────── */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between rounded-xl border bg-card px-4 py-3.5 text-sm font-semibold transition-all hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-600"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className="text-muted group-hover:text-blue-500" />
                  {label}
                </div>
                <ArrowRight size={14} className="text-muted group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Recent products ───────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-muted" />
              <h2 className="font-semibold">Recent Products</h2>
            </div>
            <Link href="/admin/products" className="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted">{product.brand} · {product.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">PKR {product.price.toLocaleString()}</span>
                  <span className={[
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    product.availability === "In Stock"
                      ? "bg-green-500/10 text-green-600"
                      : product.availability === "On Order"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-500",
                  ].join(" ")}>
                    {product.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Banner Manager ────────────────────────────── */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon size={18} className="text-muted" />
            <h2 className="font-display text-xl font-bold">Hero Banners</h2>
          </div>
          <Card className="p-5">
            <p className="mb-4 text-sm text-muted">
              Manage the homepage hero slider. Drag to reorder (coming soon). Toggle the eye icon to show/hide individual banners.
            </p>
            <BannerForm initialBanners={banners} />
          </Card>
        </div>

        {/* ── Theme Editor ──────────────────────────────── */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Palette size={18} className="text-muted" />
            <h2 className="font-display text-xl font-bold">Brand Colors</h2>
          </div>
          <Card className="p-5">
            <p className="mb-4 text-sm text-muted">
              Changes apply site-wide instantly. Click a color swatch to open the color picker.
            </p>
            <ThemeForm initialTheme={theme} />
          </Card>
        </div>

      </div>
    </AdminShell>
  )
}