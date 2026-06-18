"use client"

import { Eye, ShoppingBag } from "lucide-react"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils/format"
import type { SerializableProduct } from "@/types"

export function ProductCard({ product }: { product: SerializableProduct }) {
  const { addItem } = useCart()
  const image = product.images?.[0]
  const hasValidImage = Boolean(image?.publicId && image.publicId !== "placeholder")
  const inStock = product.availability === "In Stock"

  return (
    <div className="group flex flex-col">
      {/* Image area */}
      <div className="product-card-wrap relative overflow-hidden rounded-xl bg-[#F2F2F2]">
        <Link href={`/shop/${product.id}`} className="block aspect-square">
          {hasValidImage ? (
            <CldImage
              src={image!.publicId}
              alt={image!.alt || product.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
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
            "absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white",
            product.badge === "Best Seller" ? "bg-[#111111]" :
            product.badge === "On Sale"     ? "bg-[#DC2626]" :
            product.badge === "New Arrival" ? "bg-[#16A34A]" :
            "bg-[#525252]",
          ].join(" ")}>
            {product.badge}
          </span>
        )}

        {/* Action icons overlay — slides up on hover */}
        <div className="product-actions-overlay">
          <button
            onClick={() => addItem(product.id)}
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
      <div className="mt-3 space-y-1 px-0.5">
        {/* Brand label — matches CategoryTabProducts style */}
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#AAAAAA]">
            {product.brand}
          </p>
        )}
        <Link
          href={`/shop/${product.id}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-[#111111] transition-colors hover:text-[#525252]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#111111]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#AAAAAA] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {/* Always show availability badge — green for in-stock, grey otherwise */}
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
}