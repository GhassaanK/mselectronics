import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { getBrands } from "@/lib/firebase/catalog"

export const metadata: Metadata = {
  title: "Brands",
  alternates: { canonical: "/brands" },
}

export default async function BrandsPage() {
  const brands = await getBrands()
  const featured = brands.filter((b) => b.featured)
  const rest     = brands.filter((b) => !b.featured)

  return (
    <div>

      {/* ── Page hero ─────────────────────────────────────── */}
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
            Brands We Carry
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/50">
            Every brand is sourced through official channels. No grey market.
          </p>
        </div>
      </div>

      <div className="bg-[#F7F8FC]">
        <div className="container-page py-14 space-y-14">

          {/* Featured brands */}
          {featured.length > 0 && (
            <div>
              <p
                className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-blue-600"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Featured Brands
              </p>
              <StaggerParent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {featured.map((brand) => (
                  <StaggerChild key={brand.id}>
                    <Link
                      href={`/shop?brand=${brand.slug}`}
                      className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#E8ECF4] bg-white px-4 py-8 shadow-[0_2px_12px_rgb(10,15,30,0.06)] transition-all duration-250 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(28,78,216,0.12)]"
                    >
                      <span
                        className="text-xl font-extrabold tracking-tight text-[#0A0F1E] transition-colors group-hover:text-blue-600"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        {brand.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 opacity-0 transition-all group-hover:text-blue-500 group-hover:opacity-100">
                        View products <ArrowRight size={11} />
                      </span>
                    </Link>
                  </StaggerChild>
                ))}
              </StaggerParent>
            </div>
          )}

          {/* All brands */}
          {rest.length > 0 && (
            <div>
              <p
                className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                All Brands
              </p>
              <StaggerParent className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                {rest.map((brand) => (
                  <StaggerChild key={brand.id}>
                    <Link
                      href={`/shop?brand=${brand.slug}`}
                      className="group flex items-center justify-center rounded-xl border border-[#E8ECF4] bg-white px-4 py-5 text-sm font-bold text-slate-500 shadow-[0_1px_6px_rgb(10,15,30,0.05)] transition-all duration-200 hover:border-blue-200 hover:text-blue-600 hover:shadow-[0_4px_20px_rgb(28,78,216,0.1)]"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {brand.name}
                    </Link>
                  </StaggerChild>
                ))}
              </StaggerParent>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}