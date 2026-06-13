import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { getBrands } from "@/lib/firebase/catalog"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Brands",
  alternates: { canonical: "/brands" },
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div>
      {/* Hero */}
      <div className="border-b border-[#E5E5E5] bg-[#F8F8F8] pb-10 pt-12">
        <div className="container-page">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
            MS Electronics
          </p>

          <h1 className="text-3xl font-bold text-[#111111] md:text-4xl">
            Brands We Carry
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[#666666]">
            Every brand is sourced through official channels. No grey market.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="bg-white">
        <div className="container-page py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#AAAAAA]">
                Trusted Brands
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#111111]">
                Official Brand Partners
              </h2>
            </div>

            <div className="hidden text-sm text-[#666666] md:block">
              {brands.length} Brands Available
            </div>
          </div>

          <StaggerParent className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brands.map((brand) => (
              <StaggerChild key={brand.id}>
                <Link
                  href={`/shop?brand=${brand.slug}`}
                  className="group flex h-[150px] flex-col items-center justify-center rounded-2xl border border-[#E8ECF4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)]"
                >
                  {brand.logoUrl ? (
                    <div className="relative mb-3 h-16 w-full">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        sizes="200px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-16 items-center justify-center">
                      <span className="text-lg font-bold text-[#111111]">
                        {brand.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs font-medium text-[#666666] transition-colors group-hover:text-blue-600">
                    <span>{brand.name}</span>
                    <ArrowRight
                      size={11}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
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