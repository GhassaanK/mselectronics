import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Reveal, StaggerChild, StaggerParent } from "@/components/shared/Motion"
import { getCategories } from "@/lib/firebase/catalog"

export const metadata: Metadata = {
  title: "Categories",
  alternates: { canonical: "/categories" },
}

export default async function CategoriesPage() {
  const categories = await getCategories()

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
            All Categories
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/50">
            Browse ACs, refrigerators, TVs, kitchen appliances, and more — all in one place.
          </p>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────── */}
      <div className="bg-[#F7F8FC]">
        <div className="container-page py-14">
          <StaggerParent className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <StaggerChild key={category.id}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_12px_rgb(10,15,30,0.06)] transition-all duration-250 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_8px_30px_rgb(28,78,216,0.12)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F4FF] text-blue-600 transition-all duration-250 group-hover:bg-blue-600 group-hover:text-white">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h2
                      className="text-sm font-bold text-[#0A0F1E]"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {category.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {category.productCount} products
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Shop now <ArrowRight size={12} />
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