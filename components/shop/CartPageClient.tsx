"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/useCart"
import { cartStorageKey } from "@/lib/context/CartContext"
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp"
import { formatPrice } from "@/lib/utils/format"
import { logInquiry } from "@/lib/firebase/inquiries"
import type { SerializableProduct } from "@/types"

const MAX_QUANTITY = 10

export function CartPageClient({ products, whatsappNumber }: { products: SerializableProduct[]; whatsappNumber: string }) {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const selected = items
    .map((item) => ({ item, product: products.find((product) => product.id === (item.productId ?? item.id)) }))
    .filter((entry): entry is { item: typeof items[number]; product: SerializableProduct } => Boolean(entry.product))

  const expandedProducts = selected.flatMap(({ item, product }) =>
    Array.from({ length: Math.min(item.quantity, MAX_QUANTITY) }, () => ({
      ...product,
      name: item.variantLabel ? `${product.name} (${item.variantLabel})` : product.name,
      price: item.price ?? product.price,
    }))
  )
  const total = selected.reduce((sum, entry) => sum + (entry.item.price ?? entry.product.price) * entry.item.quantity, 0)

  async function submitInquiry() {
    const productIds = selected.map((entry) => entry.item.productId ?? entry.product.id)
    try {
      await logInquiry(productIds, "cart")
    } catch {
      // The WhatsApp handoff should still work if analytics logging fails.
    }

    clearCart()
    window.localStorage.removeItem(cartStorageKey)
    window.location.href = buildWhatsAppUrl(expandedProducts, whatsappNumber)
  }

  if (!selected.length) {
    return (
      <section className="container-page py-3xl">
        <Card className="mx-auto max-w-xl p-xl text-center">
          <h1 className="heading-tight text-3xl">Your inquiry cart is empty</h1>
          <p className="mt-md text-muted">Add products from the catalog and send them together on WhatsApp.</p>
          <Button asChild className="mt-lg"><Link href="/shop">Browse Products</Link></Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="container-page py-2xl">
      <h1 className="heading-tight mb-xl text-4xl">Inquiry cart</h1>
      <div className="grid gap-xl lg:grid-cols-[1fr_360px]">
        <div className="grid gap-md">
          {selected.map(({ item, product }) => (
            <Card key={item.id} className="flex flex-col gap-md p-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted">
                  {product.brand}{item.variantLabel ? ` - ${item.variantLabel}` : ""} - {formatPrice(item.price ?? product.price)}
                </p>
              </div>
              <div className="flex items-center gap-sm">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, MAX_QUANTITY))}
                  disabled={item.quantity >= MAX_QUANTITY}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item"><Trash2 size={16} /></Button>
              </div>
            </Card>
          ))}
        </div>
        <Card className="h-fit p-lg">
          <h2 className="heading-tight text-2xl">Summary</h2>
          <div className="my-lg flex justify-between border-y py-md">
            <span className="text-muted">Estimated total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
          <Button variant="accent" className="w-full" onClick={submitInquiry}>Send WhatsApp Inquiry</Button>
        </Card>
      </div>
    </section>
  )
}
