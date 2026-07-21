"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CldImage } from "next-cloudinary"
import { formatPrice } from "@/lib/utils/format"
import type { Category, SerializableProduct } from "@/types"

type Props = {
  categories: Category[]
  productsByCategory: Record<string, SerializableProduct[]>
}

export function CategoryTabProducts({ categories, productsByCategory }: Props) {
  const tabs = categories.filter((c) => (productsByCategory[c.slug]?.length ?? 0) > 0)
  const [activeSlug, setActiveSlug] = useState(tabs[0]?.slug ?? "")

  const products = productsByCategory[activeSlug] ?? []

  if (tabs.length === 0) return null

  return (
    <div>
      {/* ── Tab strip ─────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveSlug(cat.slug)}
            className={[
              "shrink-0 rounded px-5 py-2 text-sm font-medium transition-all duration-150",
              activeSlug === cat.slug
                ? "bg-[#111111] text-white"
                : "border border-[#E5E5E5] bg-white text-[#525252] hover:border-[#111111] hover:text-[#111111]",
            ].join(" ")}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Product grid ────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] gap-4 sm:gap-5 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => {
          const image = product.images?.[0]
          const inStock = product.availability === "In Stock"

          return (
            <div key={product.id} className="group flex min-w-0 flex-col">
              {/* Image */}
              <div className="product-card-wrap relative overflow-hidden rounded-xl border border-[#E8ECF4] bg-[#F7F8FC]">
                <Link href={`/shop/${product.id}`} className="block aspect-square">
                  {image?.publicId ? (
                    <CldImage
                      src={image.publicId}
                      alt={image.alt || product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-5"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#CCCCCC]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    </div>
                  )}
                  {/* Badge */}
                  {product.badge && (
                    <span className={[
                      "absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white",
                      product.badge === "Best Seller" ? "bg-[#111111]" :
                      product.badge === "On Sale"     ? "bg-[#DC2626]" :
                      "bg-[#16A34A]",
                    ].join(" ")}>
                      {product.badge}
                    </span>
                  )}
                </Link>
                {/* Hover overlay */}
                <div className="product-actions-overlay">
                  <Link href={`/shop/${product.id}`} className="product-action-btn" title="View Details">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 min-w-0 space-y-1 px-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#AAAAAA]">
                  {product.brand}
                </p>
                <Link
                  href={`/shop/${product.id}`}
                  className="line-clamp-2 text-sm font-medium leading-snug text-[#111111] hover:text-[#525252]"
                >
                  {product.name}
                </Link>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
                  <span className="text-sm font-semibold text-[#111111]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#AAAAAA] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <span className={[
                  "inline-block rounded px-2 py-0.5 text-[10px] font-medium",
                  inStock
                    ? "bg-[#F0FDF4] text-[#16A34A]"
                    : "bg-[#F8F8F8] text-[#525252]",
                ].join(" ")}>
                  {inStock ? "In Stock" : product.availability}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* View all */}
      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/shop?category=${activeSlug}`}
            className="inline-flex items-center gap-2 rounded border border-[#111111] px-6 py-2.5 text-sm font-semibold text-[#111111] transition-all hover:bg-[#111111] hover:text-white"
          >
            View all {tabs.find((c) => c.slug === activeSlug)?.name}
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
