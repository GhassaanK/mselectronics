import type { Metadata } from "next"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getBrands } from "@/lib/firebase/catalog"

export const metadata: Metadata = { title: "Brands", alternates: { canonical: "/brands" } }

export default async function BrandsPage() {
  const brands = await getBrands()
  return (
    <section className="container-page py-2xl">
      <SectionHeader title="Brands" description="Browse appliance brands available through MS Electronics." />
      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        {brands.map((brand) => <Link key={brand.id} href={`/shop?brand=${brand.slug}`}><Card className="grid h-28 place-items-center p-md text-lg font-bold">{brand.name}</Card></Link>)}
      </div>
    </section>
  )
}
