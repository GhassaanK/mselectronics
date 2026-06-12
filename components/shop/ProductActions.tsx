"use client"

import { MessageCircle, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { logInquiry } from "@/lib/firebase/inquiries"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import type { SerializableProduct } from "@/types"

type ProductActionsProps = {
  product: SerializableProduct
  whatsappNumber: string
}

export function ProductActions({
  product,
  whatsappNumber,
}: ProductActionsProps) {
  const { addItem } = useCart()

  const href = buildWhatsAppUrl([product], whatsappNumber)

  function handleAddToCart() {
    addItem(product.id)
  }

  function handleWhatsApp() {
    void Promise.race([
      logInquiry([product.id], "product-detail"),
      new Promise((resolve) => setTimeout(resolve, 250)),
    ])

    window.location.href = href
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-[#111111] bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#262626] hover:border-[#262626]"
      >
        <ShoppingBag size={18} />
        Add to Inquiry Cart
      </button>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1fb855]"
      >
        <MessageCircle size={18} />
        Get Best Price on WhatsApp
      </button>
    </div>
  )
}