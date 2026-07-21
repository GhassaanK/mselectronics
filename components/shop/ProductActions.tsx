"use client"

import { MessageCircle, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { logInquiry } from "@/lib/firebase/inquiries"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import type { SerializableProduct } from "@/types"

type ProductActionsProps = {
  product: SerializableProduct
  whatsappNumber: string
  /** e.g. "1.5 Ton — Silver" — appended to the WhatsApp inquiry message */
  variantLabel?: string
}

export function ProductActions({
  product,
  whatsappNumber,
  variantLabel,
}: ProductActionsProps) {
  const { addItem } = useCart()

  const href = buildWhatsAppUrl([product], whatsappNumber, variantLabel)
  const canInquire = product.availability !== "Out of Stock"

  function handleAddToCart() {
    if (!canInquire) return

    const cartId = variantLabel ? `${product.id}::${variantLabel}` : product.id
    addItem({
      id: cartId,
      productId: product.id,
      variantLabel,
      price: product.price,
      name: product.name,
    })
  }

  async function handleWhatsApp() {
    if (!canInquire) return

    try {
      await logInquiry([product.id], "product-detail")
    } catch {
      // The WhatsApp handoff should still work if analytics logging fails.
    }

    window.location.href = href
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canInquire}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-[#111111] bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#262626] hover:border-[#262626]"
      >
        <ShoppingBag size={18} />
        Add to Inquiry Cart
      </button>

      <button
        type="button"
        onClick={handleWhatsApp}
        disabled={!canInquire}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1fb855]"
      >
        <MessageCircle size={18} />
        Get Best Price on WhatsApp
      </button>
    </div>
  )
}
