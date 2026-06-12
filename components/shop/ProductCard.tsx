"use client"

import { Eye, ShoppingBag, Heart } from "lucide-react"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils/format"
import type { SerializableProduct } from "@/types"

export function ProductCard({ product }: { product: SerializableProduct }) {
  const { addItem } = useCart()
  const image = product.images?.[0] ?? { publicId: "samples/ecommerce/analog-classic", alt: product.name }
  const inStock = product.availability === "In Stock"

  return (
    <div className="group flex flex-col">
      {/* Image area */}
      <div className="product-card-wrap relative overflow-hidden rounded-xl bg-[#F2F2F2]">
        <Link href={`/shop/${product.id}`} className="block aspect-square">
          <CldImage
            src={image.publicId}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
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
          <button
            aria-label="Wishlist"
            className="product-action-btn"
            title="Wishlist"
          >
            <Heart size={15} />
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
        {!inStock && (
          <span className="inline-block rounded bg-[#F8F8F8] px-2 py-0.5 text-[10px] font-semibold text-[#525252]">
            {product.availability}
          </span>
        )}
      </div>
    </div>
  )
}