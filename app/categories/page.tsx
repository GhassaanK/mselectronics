import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { getCategories } from "@/lib/firebase/catalog"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Categories",
  alternates: { canonical: "/categories" },
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] py-10 sm:py-12">
        <div className="container-page">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
            MS Electronics
          </p>

          <h1 className="text-3xl font-bold text-[#111111] md:text-4xl">
            All Categories
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[#666666]">
            Browse ACs, refrigerators, TVs, kitchen appliances, and more —
            all in one place.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white">
        <div className="container-page py-10 sm:py-12">
          <div className="responsive-section-head mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
                Shop By Category
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#111111]">
                Explore Product Categories
              </h2>
            </div>

            <div className="hidden text-sm text-[#666666] md:block">
              {categories.length} Categories
            </div>
          </div>

          <StaggerParent className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-4 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => (
              <StaggerChild key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#E8ECF4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)]"
                >
                  {/* Category Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F8F8]">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#F8F8F8]">
                        <span className="text-sm text-[#AAAAAA]">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="text-sm font-bold text-[#111111]">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-xs text-[#999999]">
                      {category.productCount} products
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Shop now
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </div>
    </div>
  )
}
