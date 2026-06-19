import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProductDetailClient } from "@/components/shop/ProductDetailClient"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Reveal } from "@/components/shared/Motion"
import { getSiteSettings } from "@/lib/firebase/catalog"
import { getProductById, getProductsByCategory } from "@/lib/firebase/products"
import { formatPrice } from "@/lib/utils/format"
import { serializeProduct, serializeProducts } from "@/lib/utils/serialize"
import { brandConfig } from "@/config/brand"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  if (!id) return { title: "Product not found" }

  const product = await getProductById(id)

  if (!product) return { title: "Product not found" }

  return {
    title: product.name,
    description: `${product.brand} ${product.category} at MS Electronics.`,
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: `${formatPrice(product.price)} · ${product.availability}`,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  if (!id) notFound()

  const [product, settings] = await Promise.all([
    getProductById(id),
    getSiteSettings(),
  ])

  if (!product) notFound()

  const related = (await getProductsByCategory(product.category))
    .filter((item) => item.id !== product.id)
    .slice(0, 4)

  const serializedProduct = serializeProduct(product)
  const serializedRelated = serializeProducts(related)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.availability === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[#E5E5E5] bg-white">
        <div className="container-page flex items-center gap-2 py-3.5 text-xs text-slate-400">
          <Link href="/" className="transition-colors hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-slate-700">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="transition-colors hover:text-slate-700">
            {product.category}
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate font-medium text-slate-600">{product.name}</span>
        </div>
      </div>

      {/* All interactive product detail sections */}
      <ProductDetailClient
        product={serializedProduct}
        whatsappNumber={settings.whatsappNumber || brandConfig.whatsappNumber}
      />

      {/* Related products — stays server-rendered */}
      {related.length > 0 && (
        <div className="bg-white">
          <div className="container-page py-14">
            <Reveal>
              <div className="mb-10 flex items-end justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#111111]">
                    More in {product.category}
                  </span>
                  <h2 className="text-2xl font-bold text-[#111111] md:text-3xl">Related Products</h2>
                </div>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="hidden items-center gap-1 text-sm font-semibold text-[#111111] transition hover:gap-2 sm:flex"
                >
                  View all <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            </Reveal>
            <ProductGrid products={serializedRelated} />
          </div>
        </div>
      )}
    </div>
  )
}