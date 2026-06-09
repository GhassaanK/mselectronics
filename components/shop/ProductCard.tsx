"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils/format"
import type { SerializableProduct } from "@/types"

export function ProductCard({ product }: { product: SerializableProduct }) {
  const { addItem } = useCart()
  const image = product.images?.[0] ?? { publicId: "samples/ecommerce/analog-classic", alt: product.name }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden">
        <Link href={`/shop/${product.id}`} className="block bg-surface">
          <div className="relative aspect-[4/3]">
            {product.badge ? <span className="absolute left-md top-md z-10 rounded-sm bg-accent px-sm py-xs text-xs font-semibold text-white">{product.badge}</span> : null}
            <CldImage src={image.publicId} alt={image.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-lg transition duration-premium group-hover:scale-[1.03]" />
          </div>
        </Link>
        <div className="grid gap-sm p-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-muted">{product.brand} · {product.category}</p>
            <Link href={`/shop/${product.id}`} className="mt-xs line-clamp-2 block min-h-11 font-semibold text-foreground">{product.name}</Link>
          </div>
          <div className="flex items-end justify-between gap-sm">
            <div>
              <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              {product.originalPrice ? <p className="text-sm text-muted line-through">{formatPrice(product.originalPrice)}</p> : null}
            </div>
            <Button size="icon" variant="outline" aria-label={`Add ${product.name} to inquiry cart`} onClick={() => addItem(product.id)}>
              <ShoppingBag size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
