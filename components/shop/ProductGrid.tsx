import { ProductCard } from "@/components/shop/ProductCard"
import type { SerializableProduct } from "@/types"

export function ProductGrid({ products }: { products: SerializableProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
