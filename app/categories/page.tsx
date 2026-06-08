import type { Metadata } from "next"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { getCategories } from "@/lib/firebase/catalog"

export const metadata: Metadata = { title: "Categories", alternates: { canonical: "/categories" } }

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <section className="container-page py-2xl">
      <SectionHeader title="Categories" description="Explore ACs, refrigerators, TVs, kitchen appliances, and more." />
      <div className="grid grid-cols-2 gap-md md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/shop?category=${category.slug}`}>
            <Card className="p-lg">
              <h2 className="font-bold">{category.name}</h2>
              <p className="mt-sm text-sm text-muted">{category.productCount} products</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
