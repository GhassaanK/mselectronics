import type { Metadata } from "next"
import { Suspense } from "react"
import { BadgeCheck, PackageCheck, SlidersHorizontal, Store } from "lucide-react"
import { ShopFilters } from "@/components/shop/ShopFilters"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"

export const revalidate = 30

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
    <div className="bg-white">
      <div className="border-b border-[#E5E7EB] bg-gradient-to-b from-[#F8FAFC] to-white pb-8 pt-10 sm:pb-10 sm:pt-12">
        <div className="container-page">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
            MS Electronics
          </p>
          <h1 className="text-3xl font-bold text-[#0A0F1E] md:text-4xl">
            Browse Appliances
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Compare genuine appliances by category, brand, availability, and budget before sending a WhatsApp inquiry.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <span className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <PackageCheck size={14} className="text-blue-600" />
              {products.length} products available
            </span>
            <span className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <SlidersHorizontal size={14} className="text-blue-600" />
              {categories.length} categories
            </span>
            <span className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
              <BadgeCheck size={14} className="text-blue-600" />
              {brands.length} brands
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC]">
        <div className="container-page py-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
                <Store size={16} />
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
