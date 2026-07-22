"use client"

import { useState } from "react"
import { Eye, ShoppingBag } from "lucide-react"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils/format"
import type { SerializableProduct } from "@/types"

export function ProductCard({ product }: { product: SerializableProduct }) {
  const { addItem } = useCart()

  const baseImages = (product.images ?? []).filter(
    (img) => img?.publicId && img.publicId !== "placeholder"
  )
  const colorVariants = product.colorVariants ?? []
  const hasColorVariants = colorVariants.length > 0

  // Track which color is "pinned" by a click (null = base)
  const [pinnedColorId, setPinnedColorId] = useState<string | null>(null)
  // Track which color is hovered (null = none)
  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null)

  // Resolve the active color variant for display
  const activeColorId = hoveredColorId ?? pinnedColorId
  const activeColor = colorVariants.find((v) => v.id === activeColorId) ?? null

  // Resolve which images to show
  const displayImages = activeColor?.images?.length
    ? activeColor.images
    : baseImages

  const hasImages = displayImages.length > 0

  // For products WITHOUT color variants: hover switches to images[1] (existing behaviour)
  const [baseHovered, setBaseHovered] = useState(false)

  const activeImage = hasColorVariants
    ? displayImages[0]
    : baseHovered && displayImages.length > 1
      ? displayImages[1]
      : displayImages[0]

  const inStock = product.availability === "In Stock"

  function handleAddToCart() {
    if (!inStock) return

    addItem({
      id: product.id,
      productId: product.id,
      price: product.price,
      name: product.name,
    })
  }

  function handleCardMouseEnter() {
    if (!hasColorVariants) setBaseHovered(true)
  }

  function handleCardMouseLeave() {
    if (!hasColorVariants) setBaseHovered(false)
    setHoveredColorId(null)
  }

  return (
    <article
      className="group flex min-w-0 flex-col rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0_1px_2px_rgb(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_38px_rgb(15,23,42,0.10)]"
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      {/* Image area */}
      <div className="product-card-wrap relative overflow-hidden rounded-md bg-gradient-to-b from-[#F8FAFC] to-white">
        <Link href={`/shop/${product.id}`} className="block aspect-square">
          {hasImages ? (
            <CldImage
              key={activeImage?.publicId}
              src={activeImage?.publicId ?? ""}
              alt={activeImage?.alt || product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-4 transition-all duration-300 group-hover:scale-105 sm:p-5"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#CCCCCC]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
          )}
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={[
            "absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm",
            product.badge === "Best Seller" ? "bg-[#111111]" :
            product.badge === "On Sale"     ? "bg-[#DC2626]" :
            product.badge === "New Arrival" ? "bg-[#16A34A]" :
            "bg-[#525252]",
          ].join(" ")}>
            {product.badge}
          </span>
        )}

        {/* Action icons overlay */}
        <div className="product-actions-overlay">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            aria-label={`Add ${product.name} to inquiry cart`}
            className="product-action-btn"
            title="Add to Inquiry Cart"
          >
            <ShoppingBag size={15} />
          </button>
          <Link
            href={`/shop/${product.id}`}
            aria-label="View product"
            className="product-action-btn"
            title="View Details"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {/* Info area */}
      <div className="flex flex-1 min-w-0 flex-col gap-2 px-1.5 pb-2 pt-3">
        <div className="flex min-h-5 items-center justify-between gap-2">
          {product.brand ? (
            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-blue-600">
              {product.brand}
            </p>
          ) : <span />}
          <span className={[
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            inStock
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}>
            {inStock ? "In Stock" : product.availability}
          </span>
        </div>

        <Link
          href={`/shop/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-[#111111] transition-colors hover:text-blue-700"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex flex-wrap items-end gap-x-2 gap-y-1 pt-1">
          <span className="text-[0.95rem] font-bold leading-none text-[#0A0F1E]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs leading-none text-[#94A3B8] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color swatches — always visible when color variants exist */}
        {hasColorVariants && (
          <div className="flex items-center gap-1.5 pt-1">
            {colorVariants.map((variant) => {
              const isPinned = variant.id === pinnedColorId
              return (
                <button
                  key={variant.id}
                  type="button"
                  title={variant.label}
                  aria-label={`View in ${variant.label}`}
                  aria-pressed={isPinned}
                  onClick={(e) => {
                    e.preventDefault()
                    setPinnedColorId(isPinned ? null : variant.id)
                  }}
                  onMouseEnter={() => setHoveredColorId(variant.id)}
                  onMouseLeave={() => setHoveredColorId(null)}
                  className={[
                    "relative h-4 w-4 rounded-full border shadow-sm transition-all duration-150",
                    isPinned
                      ? "border-[#111111] scale-110"
                      : "border-[#E5E5E5] hover:border-[#AAAAAA] hover:scale-110",
                  ].join(" ")}
                  style={{ backgroundColor: variant.hex }}
                />
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
