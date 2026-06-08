"use client"

import { MessageCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { logInquiry } from "@/lib/firebase/inquiries"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import type { SerializableProduct } from "@/types"

export function ProductActions({ product, whatsappNumber }: { product: SerializableProduct; whatsappNumber: string }) {
  const { addItem } = useCart()
  const href = buildWhatsAppUrl([product], whatsappNumber)

  function getBestPrice() {
    void Promise.race([
      logInquiry([product.id], "product-detail"),
      new Promise((resolve) => setTimeout(resolve, 250))
    ])
    window.location.href = href
  }

  return (
    <div className="grid gap-sm">
      <Button variant="accent" onClick={() => addItem(product.id)}>
        <ShoppingBag size={18} />
        Add to Inquiry Cart
      </Button>
      <Button type="button" onClick={getBestPrice}>
        <MessageCircle size={18} />
        Get Best Price on WhatsApp
      </Button>
    </div>
  )
}
