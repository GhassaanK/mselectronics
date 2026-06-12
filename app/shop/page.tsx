import type { Metadata } from "next"
import { Suspense } from "react"
import { SlidersHorizontal } from "lucide-react"
import { ShopFilters } from "@/components/shop/ShopFilters"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Shop Appliances",
  alternates: { canonical: "/shop" },
}

export default async function ShopPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ])

  return (
    <div>

      {/* ── Page hero band ──────────────────────────────── */}
      <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] pb-10 pt-12">
        <div className="container-page">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
            MS Electronics
          </p>
          <h1 className="text-3xl font-bold text-[#111111] md:text-4xl">
            Browse Appliances
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#666666]">
            Search, filter by category or brand, then shortlist items for a WhatsApp inquiry.
          </p>

          {/* Stat pills */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-[#525252]">
              <SlidersHorizontal size={12} className="text-[#AAAAAA]" />
              {products.length} products available
            </span>
            <span className="flex items-center gap-2 rounded border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-[#525252]">
              {categories.length} categories
            </span>
            <span className="flex items-center gap-2 rounded border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-[#525252]">
              {brands.length} brands
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters + product grid ──────────────────────── */}
      <div className="bg-white">
        <div className="container-page py-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24 text-sm text-[#AAAAAA]">
                Loading products...
              </div>
            }
          >
            <ShopFilters
              products={serializeProducts(products)}
              categories={categories}
              brands={brands}
            />
          </Suspense>
        </div>
      </div>

    </div>
  )
}