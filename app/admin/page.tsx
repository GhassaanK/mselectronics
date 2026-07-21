import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  FolderTree,
  Image as ImageIcon,
  MessageSquare,
  Package,
  PackagePlus,
  Settings,
  Tags,
  TrendingUp,
} from "lucide-react"
import { AdminShell } from "@/components/admin/AdminShell"
import { BannerForm } from "@/components/admin/BannerForm"
import { Card } from "@/components/ui/card"
import { getProductThumbnail } from "@/lib/cloudinary/utils"
import { getBanners } from "@/lib/firebase/banners"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getInquiryCount } from "@/lib/firebase/inquiries"
import { getProducts } from "@/lib/firebase/products"

export const revalidate = 0

function stockClass(status: string) {
  if (status === "In Stock") return "bg-green-50 text-green-700"
  if (status === "On Order") return "bg-amber-50 text-amber-700"
  return "bg-red-50 text-red-700"
}

export default async function AdminPage() {
  const [products, categories, brands, banners, inquiryCount] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getBanners(),
    getInquiryCount(),
  ])

  const inStock = products.filter((product) => product.availability === "In Stock").length
  const featured = products.filter((product) => product.featured).length
  const missingImages = products.filter((product) => !product.images?.length).length
  const activeBanners = banners.filter((banner) => banner.active).length

  const stats = [
    { label: "Products", value: products.length, helper: `${inStock} in stock`, icon: Package },
    { label: "Categories", value: categories.length, helper: "Catalog groups", icon: FolderTree },
    { label: "Brands", value: brands.length, helper: "Supplier catalog", icon: Tags },
    { label: "Inquiries", value: inquiryCount, helper: "Tracked WhatsApp leads", icon: MessageSquare },
  ]

  const quickLinks = [
    { href: "/admin/products/new", label: "Add product", helper: "Create a catalog item", icon: PackagePlus },
    { href: "/admin/products", label: "Review products", helper: `${missingImages} missing images`, icon: Package },
    { href: "/admin/categories", label: "Categories", helper: "Manage product groups", icon: FolderTree },
    { href: "/admin/settings", label: "Store settings", helper: "WhatsApp and company info", icon: Settings },
  ]

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#737373]">
              Admin overview
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-[#737373]">
              Monitor catalog health, product imagery, homepage banners, and store content.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#111111] px-5 text-sm font-semibold text-white transition hover:bg-[#333333]"
          >
            <PackagePlus size={16} />
            New Product
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, helper, icon: Icon }) => (
            <Card key={label} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#737373]">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-[#111111]">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-[#737373]">{helper}</p>
                </div>
                <div className="rounded-md bg-[#F2F2F2] p-2.5 text-[#111111]">
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-3">
            <p className="text-xs text-[#737373]">Featured products</p>
            <p className="mt-1 text-xl font-bold text-[#111111]">{featured}</p>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-3">
            <p className="text-xs text-[#737373]">Missing images</p>
            <p className="mt-1 text-xl font-bold text-[#111111]">{missingImages}</p>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-3">
            <p className="text-xs text-[#737373]">Active banners</p>
            <p className="mt-1 text-xl font-bold text-[#111111]">{activeBanners}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#737373]">
            Common tasks
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map(({ href, label, helper, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-lg border border-[#E5E5E5] bg-white p-4 transition hover:border-[#111111] hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                      <Icon size={16} />
                      {label}
                    </div>
                    <p className="mt-2 text-xs text-[#737373]">{helper}</p>
                  </div>
                  <ArrowRight size={15} className="text-[#AAAAAA] transition group-hover:translate-x-0.5 group-hover:text-[#111111]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden rounded-lg">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#737373]" />
              <h2 className="font-bold text-[#111111]">Recent products</h2>
            </div>
            <Link href="/admin/products" className="text-xs font-bold text-[#111111] hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-[#E5E5E5]">
            {products.slice(0, 6).map((product) => {
              const image = product.images?.[0]

              return (
                <div key={product.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F8F8F8]">
                      {image?.publicId ? (
                        <Image
                          src={getProductThumbnail(image.publicId)}
                          alt={image.alt || product.name}
                          fill
                          sizes="56px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <ImageIcon size={17} className="text-[#AAAAAA]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111111]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#737373]">
                        {product.brand} / {product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-sm font-semibold text-[#111111] sm:inline">
                      PKR {product.price.toLocaleString()}
                    </span>
                    <span className={["rounded-full px-2.5 py-1 text-xs font-semibold", stockClass(product.availability)].join(" ")}>
                      {product.availability}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-[#737373]" />
              <h2 className="text-lg font-bold text-[#111111]">Homepage banners</h2>
            </div>
            <span className="rounded bg-[#F2F2F2] px-2 py-1 text-xs font-semibold text-[#525252]">
              {activeBanners} active
            </span>
          </div>
          <BannerForm initialBanners={banners} />
        </Card>
      </div>
    </AdminShell>
  )
}
