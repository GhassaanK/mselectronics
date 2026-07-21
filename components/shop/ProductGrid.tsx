import { ProductCard } from "@/components/shop/ProductCard"
import type { SerializableProduct } from "@/types"

export function ProductGrid({ products }: { products: SerializableProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mb-4 text-[#CCCCCC]"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <p className="text-sm font-semibold text-[#111111]">No products found</p>
        <p className="mt-1 text-sm text-[#AAAAAA]">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
