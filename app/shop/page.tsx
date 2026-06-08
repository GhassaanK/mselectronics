import type { Metadata } from "next"
import { ShopFilters } from "@/components/shop/ShopFilters"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getBrands, getCategories } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"

export const revalidate = 3600
export const metadata: Metadata = {
  title: "Shop Appliances",
  alternates: { canonical: "/shop" }
}

export default async function ShopPage() {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()])

  return (
    <section className="container-page py-2xl">
      <SectionHeader title="Browse appliances" description="Search and filter products, then add your shortlisted items to a WhatsApp inquiry." />
      <ShopFilters products={serializeProducts(products)} categories={categories} brands={brands} />
    </section>
  )
}
