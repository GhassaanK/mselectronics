import type { Metadata } from "next"
import { CartPageClient } from "@/components/shop/CartPageClient"
import { brandConfig } from "@/config/brand"
import { getSiteSettings } from "@/lib/firebase/catalog"
import { getProducts } from "@/lib/firebase/products"
import { serializeProducts } from "@/lib/utils/serialize"

export const metadata: Metadata = { title: "Inquiry Cart", alternates: { canonical: "/cart" } }

export default async function CartPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()])
  return <CartPageClient products={serializeProducts(products)} whatsappNumber={settings.whatsappNumber || brandConfig.whatsappNumber} />
}
