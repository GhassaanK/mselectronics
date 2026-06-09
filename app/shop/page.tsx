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
      <div className="bg-[#0A0F1E] pb-12 pt-14">
        <div className="container-page">
          <p
            className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-400"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            MS Electronics
          </p>
          <h1
            className="text-3xl font-extrabold text-white md:text-4xl"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
          >
            Browse Appliances
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/50">
            Search, filter by category or brand, then shortlist items for a WhatsApp inquiry.
          </p>

          {/* Stat pills */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60">
              <SlidersHorizontal size={12} className="text-blue-400" />
              {products.length} products available
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60">
              {categories.length} categories
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60">
              {brands.length} brands
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters + product grid ──────────────────────── */}
      <div className="bg-[#F7F8FC]">
        <div className="container-page py-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24 text-sm text-slate-400">
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